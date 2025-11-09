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
| `id`               | `Number`        | A unique identifier for the question. Essential for tracking mistakes and review schedules.                     | `1001`                                                                                              |
| `kategori`         | `String`        | The subject or category of the question (e.g., "Ölçme ve Değerlendirme"). Used for filtering.                     | `"Gelişim Psikolojisi"`                                                                             |
| `zorluk`           | `String`        | The difficulty level of the question. Can be "kolay", "orta", or "zor". Used for filtering.                     | `"orta"`                                                                                            |
| `soruMetni`        | `String`        | The full text of the question. Can include markdown for emphasis (e.g., **bold** for negative stems).           | `"Aşağıdakilerden hangisi Piaget'nin bilişsel gelişim dönemlerinden biri **değildir**?"`             |
| `secenekler`       | `Array<String>` | An array of 4 strings representing the multiple-choice options. The order can be shuffled by the client.        | `["Duyusal-Motor", "İşlem Öncesi", "Soyut İşlemler", "Gizil Dönem"]`                                  |
| `dogruCevapIndex`  | `Number`        | The 0-based index of the correct answer in the `secenekler` array *before* it is shuffled.                      | `3`                                                                                                 |
| `aciklama`         | `String`        | A detailed explanation of why the correct answer is right and the others are wrong. Displayed after answering.  | `"Gizil dönem, Freud'un psikanalitik kuramında yer alan bir evredir. Piaget'nin dönemleri..."`        |

**Example `sorular.json`:**
```json
[
  {
    "id": 1001,
    "kategori": "Ölçme ve Değerlendirme",
    "zorluk": "kolay",
    "soruMetni": "Bir testin aynı gruba farklı zamanlarda uygulanmasıyla elde edilen sonuçlar arasındaki tutarlılık, testin hangi özelliğini gösterir?",
    "secenekler": [
      "Geçerlik",
      "Güvenirlik",
      "Kullanışlılık",
      "Objektiflik"
    ],
    "dogruCevapIndex": 1,
    "aciklama": "Güvenirlik, bir ölçme aracının tutarlı ve kararlı sonuçlar verme derecesidir. Geçerlik ise ölçmek istediği özelliği ne kadar doğru ölçtüğüdür."
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
| `mistakeBank`    | `Array<Number>`       | An array of `id`s for questions the user has answered incorrectly. Questions are removed when answered correctly in "Mistake Bank" mode. | `[1001, 2045, 3012]`                                                 |
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
