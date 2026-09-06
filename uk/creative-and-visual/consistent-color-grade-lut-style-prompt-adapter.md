---
id: consistent-color-grade-lut-style-prompt-adapter
title: Адаптер узгодженого кольорокорекції у стилі LUT
category: creative-and-visual
tags: [style-transfer, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: uk
last_updated: 2026-09-06
---

## Опис
Застосовує один описаний «настрій» кольорокорекції (обробка тіней/світлів, кольоровий відтінок, контраст, текстура) послідовно до набору інакше різних промптів для зображень — різні сюжети, композиції, навіть різні базові стилі — щоб змішана добірка (продуктовий рендер, лайфстайл-фото, ілюстрація) читалась як одна відкорегована кампанія, не торкаючись власної лексики сюжету чи стилю жодного промпту. Відрізняється від заміни цілого художнього стилю на один незмінний сюжет (це завдання «Адаптера промпту переносу стилю»): цей промпт залишає сюжет і стиль кожного промпту незмінними та уніфікує лише накладену кольорову обробку — так само, як справжній продакшн-LUT уніфікує відзняте на різних камерах.

## Коли використовувати
- Маєш добірку вже робочих промптів для кампанії (різні продукти, сцени чи навіть різні візуальні стилі) і треба, щоб вони відчувались як одна уніфікована зйомка після кольорокорекції.
- Клієнт чи брендбук задає фірмовий кольоровий настрій (напр., «завжди teal-and-orange», «десатуроване, крім брендового червоного»), який має зберігатись у різнорідній добірці згенерованих активів.
- Збираєш мудборд чи прев'ю кампанії з різнорідних джерел і хочеш швидко застосувати узгоджену кольорокорекцію рівномірно перед тим, як вирішувати, які зображення потребують доопрацювання.

## Промпт

```
[СПЕЦИФІКАЦІЯ КОЛЬОРОКОРЕКЦІЇ — повторюй дослівно, додаючи до кожного промпту в наборі]
{{GRADE_NAME}}, shadows: {{SHADOW_TREATMENT}}, highlights: {{HIGHLIGHT_TREATMENT}}, color cast: {{COLOR_CAST}}, contrast: {{CONTRAST_LEVEL}}, texture: {{GRAIN_OR_TEXTURE}}

[ЗАСТОСУВАННЯ ДО ПРОМПТУ 1 — не змінюй наявну лексику сюжету/стилю]
{{EXISTING_PROMPT_1}}, {{GRADE_NAME}} color grade, {{SHADOW_TREATMENT}}, {{HIGHLIGHT_TREATMENT}}, {{COLOR_CAST}}, {{CONTRAST_LEVEL}}, {{GRAIN_OR_TEXTURE}}

[ЗАСТОСУВАННЯ ДО ПРОМПТУ 2 — той самий блок кольорокорекції, інший вихідний промпт]
{{EXISTING_PROMPT_2}}, {{GRADE_NAME}} color grade, {{SHADOW_TREATMENT}}, {{HIGHLIGHT_TREATMENT}}, {{COLOR_CAST}}, {{CONTRAST_LEVEL}}, {{GRAIN_OR_TEXTURE}}
```

## Змінні
- `{{GRADE_NAME}}` — конкретний, названий настрій (напр., «teal-and-orange cinematic grade», «sun-bleached film grade»), а не розмите «гарні кольори». Обов'язково.
- `{{SHADOW_TREATMENT}}` — як рендеряться тіні (напр., «deep teal, slightly crushed shadows»). Обов'язково.
- `{{HIGHLIGHT_TREATMENT}}` — як рендеряться світла (напр., «soft, slightly warm blown highlights»). Обов'язково.
- `{{COLOR_CAST}}` — загальний відтінок на все зображення (напр., «subtle warm cast on skin tones, cool cast elsewhere»). Обов'язково.
- `{{CONTRAST_LEVEL}}` — характер контрасту (напр., «high contrast, punchy» проти «low contrast, flat film-like»). Обов'язково.
- `{{GRAIN_OR_TEXTURE}}` — будь-який шар текстури (напр., «fine 35mm film grain», «clean, no grain»). Необов'язково, але рекомендовано — узгодженість зерна/текстури так само помітна, як і колір, при порівнянні зображень поруч.
- `{{EXISTING_PROMPT_1}}` / `{{EXISTING_PROMPT_2}}` (розширюй до потрібної кількості промптів у наборі) — вже робочі, різнорідні промпти, чий сюжет і стиль мають лишитись незмінними; до кожного лише додається блок кольорокорекції.

## Приклад
**Вхід:** `{{GRADE_NAME}}` = «teal-and-orange cinematic grade» · `{{SHADOW_TREATMENT}}` = «deep teal, slightly crushed shadows» · `{{HIGHLIGHT_TREATMENT}}` = «warm orange, softly blown highlights» · `{{COLOR_CAST}}` = «subtle warm cast on skin tones, cool cast elsewhere» · `{{CONTRAST_LEVEL}}` = «high contrast, punchy» · `{{GRAIN_OR_TEXTURE}}` = «fine 35mm film grain» · `{{EXISTING_PROMPT_1}}` = «A pair of running shoes on a concrete studio floor, dramatic side lighting, product photography» · `{{EXISTING_PROMPT_2}}` = «A runner tying their shoelaces on a city sidewalk at dawn, candid lifestyle photography»

**Застосування до Промпту 1:**
```
A pair of running shoes on a concrete studio floor, dramatic side lighting, product photography, teal-and-orange cinematic grade color grade, deep teal, slightly crushed shadows, warm orange, softly blown highlights, subtle warm cast on skin tones, cool cast elsewhere, high contrast, punchy, fine 35mm film grain
```

**Застосування до Промпту 2:**
```
A runner tying their shoelaces on a city sidewalk at dawn, candid lifestyle photography, teal-and-orange cinematic grade color grade, deep teal, slightly crushed shadows, warm orange, softly blown highlights, subtle warm cast on skin tones, cool cast elsewhere, high contrast, punchy, fine 35mm film grain
```

## Поради та варіації
- Поєднуй з «Адаптером промпту переносу стилю» (`style-transfer-prompt-adapter`, creative-and-visual, вже випущений): той промпт заміняє цілий художній стиль, зберігаючи один сюжет незмінним; цей залишає сюжет і стиль кожного промпту незмінними й уніфікує лише кольорокорекцію в кількох різних сюжетах і стилях. Використовуй їх разом у кампанії, де потрібне обидва — спершу адаптуй промпти-«виключення» до спільного стилю, потім прожени цей прохід, щоб закріпити спільний кольоровий настрій зверху.
- Найпоширеніша помилка — надто сильно прописати кольорокорекцію так, що вона суперечить терміну, вже наявному у вихідному промпті (напр., накладати «crushed cool shadows» на промпт, що вже каже «bright, high-key lighting»). Якщо якийсь промпт «чинить опір» кольорокорекції, спершу перевір, чи немає в ньому суперечливого терміну освітлення, перш ніж вважати помилковим сам опис кольорокорекції.
- Для справжнього постпродакшн-застосування LUT (не кольорового напрямку на етапі промпту) розглядай результат цього промпту лише як відправну точку — реальний LUT, застосований у програмі кольорокорекції до фінальних рендерів, завжди буде точнішим і узгодженішим, ніж закладання вигляду в промпт генерації.

## Історія змін
- 1.0.0 (2026-09-06): Початкова версія.
