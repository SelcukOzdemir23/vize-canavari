# Spec: 02 - Data Structures

This document defines the core data structures for the "Vize Canavarı" application. These serve as the "single source of truth" for the data that flows through the app.

## 1. Quiz Content Structure (`sorular.json`)

This structure defines the format of the questions that will be loaded into the application. It is an array of question objects.

**File:** `public/sorular.json`

**Type:** `Array<Question>`

---

### The `Question` Object

| Field Name         | Type            | Description                                                                                                     | Example                                                                                             |
| ------------------ | --------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `id`               | `String`        | A unique identifier (slug-like) for the question. Stored as-is for review schedules and mistake bank tracking.  | `"eay_1_1"`                                                                                        |
| `konu`             | `String`        | The topic heading displayed on the question card (e.g., "Bilimsel Tutum").                                     | `"Bilimsel Tutum"`                                                                                 |
| `zorluk`           | `String`        | Difficulty label. Current dataset uses title case values: "Kolay", "Orta", "Zor".                             | `"Kolay"`                                                                                        |
| `tip`              | `String?`       | Optional tag describing the item type (e.g., "Teorik", "Senaryo"). Used as a secondary badge when present.   | `"Senaryo"`                                                                                       |
| `soruMetni`        | `String`        | The full text of the question. Supports rich formatting elements already embedded in the JSON.                 | `"Aşağıdakilerden hangisi bilimin temel özelliklerinden biridir?"`                                 |
| `secenekler`       | `Array<String>` | An array of answer choices in display order.                                                                    | `["Kanıta ve deneye dayanması", "Kişisel sezgilere dayanması", ...]`                               |
| `dogruCevap`       | `String`        | The exact answer text that matches one entry in `secenekler`.                                                   | `"Kanıta ve deneye dayanması"`                                                                     |
| `dogruCevapIndex`  | `Number`        | Derived at runtime by matching `dogruCevap` against `secenekler`. Used for answer checking.                     | `0`                                                                                                 |
| `aciklama`         | `String`        | Explanation shown after the user answers. Can include inline references such as `[cite: 33]`.                   | `"Bilim, olguları açıklamak için kanıta ve deneye dayalı sistematik bir bilgi bütünüdür."`          |

**Example `sorular.json`:**
```json
[
  {
    "id": "eay_1_1",
    "konu": "Bilimin Anlamı",
    "tip": "Teorik",
    "zorluk": "Kolay",
    "soruMetni": "Aşağıdakilerden hangisi bilimin temel özelliklerinden biri olarak kabul edilir?",
    "secenekler": [
      "Kanıta ve deneye dayanması",
      "Kişisel sezgilere dayanması",
      "Değişmez ve mutlak olması",
      "Sadece doğa olaylarını incelemesi"
    ],
    "dogruCevap": "Kanıta ve deneye dayanması",
    "aciklama": "Bilim, olguları açıklamak için kanıta ve deneye dayalı sistematik bir bilgi bütünüdür."
  }
]
```

## 2. User Session Structure (`localStorage`)

This structure defines the object that will be saved in the browser's `localStorage` to persist the user's progress and preferences between sessions.

**Storage Key:** `vizeCanavariSession`

**Type:** `UserSession`

---

### The `UserSession` Object

| Field Name       | Type                  | Description                                                                                                                            | Example                                                              |
| ---------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `mistakeBank`    | `Array<String>`       | An array of question `id`s the user answered incorrectly. Questions are removed when answered correctly in "Mistake Bank" mode.       | `["eay_1_1", "eay_2_4"]`                                          |
| `reviewSchedule` | `Object`              | A dictionary where keys are question `id`s and values are `ReviewItem` objects for the spaced repetition system.                         | `{ "1001": { "level": 1, "dueDate": "2025-11-08T10:00:00Z" } }`       |
| `streak`         | `Object`              | An object containing information about the user's daily study streak.                                                                  | `{ "count": 5, "lastStudiedDate": "2025-11-07" }`                     |
| `settings`       | `Object`              | User-specific settings, such as preferred theme (e.g., "dark") or animation preferences.                                               | `{ "theme": "dark" }`                                                |

---

### The `ReviewItem` Object (for `reviewSchedule`)

| Field Name | Type     | Description                                                                                             | Example                    |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------- | -------------------------- |
| `level`    | `Number` | The current "box" or level in the spaced repetition system (e.g., 1-8). Higher levels mean longer delays. | `3`                        |
| `dueDate`  | `String` | An ISO 8601 timestamp indicating the next time the question should be reviewed.                         | `"2025-11-15T10:00:00Z"`   |

### The `Streak` Object

| Field Name        | Type     | Description                                                                                             | Example        |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------- | -------------- |
| `count`           | `Number` | The number of consecutive days the user has studied.                                                    | `5`            |
| `lastStudiedDate` | `String` | The date of the last study session in `YYYY-MM-DD` format. Used to check if the streak should be incremented or reset. | `"2025-11-07"` |
