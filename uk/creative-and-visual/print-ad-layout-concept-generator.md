---
id: print-ad-layout-concept-generator
title: Генератор концепцій макета друкованої реклами
category: creative-and-visual
tags: [product-mockups, photography]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: uk
last_updated: 2026-09-06
---

## Опис
Генерує 3 структурно різні концепції макета друкованої реклами під повне поле (full-bleed) для того самого продукту чи бренду — підхід на основі продукту-героя, підхід на основі лайфстайл-сцени й підхід на основі графіки/типографіки — кожна з зарезервованим місцем під заголовок, основний текст і логотип, щоб концепції реально можна було порівняти як стратегії макета, а не як кольорові варіації одного макета. Друкований аналог техніки зарезервованого місця під текст з промпту A/B-тестування превʼю: тут вона адаптована під формати друку під повне поле (сторінка журналу, постер, зовнішня реклама) замість відеопревʼю 16:9.

## Коли використовувати
- Презентуєш напрямки макета друкованої реклами (журнал, постер, зовнішня реклама) для продукту й хочеш реально різні стратегії макета для реакції, а не три кадрування того самого героя-кадру.
- Потрібно поставити завдання дизайнеру-графіку чи медіабаєру з візуальним відчуттям, скільки місця під текст реально вміщує макет, перш ніж переходити до фінального дизайну.
- Хочеш порівняти, чи найкраще пасує кампанії підхід на основі продукту, лайфстайлу чи типографіки, перш ніж вкладатись у повноцінну продакшн-зйомку чи ілюстрацію.

## Промпт

```
[ОСНОВА РЕКЛАМИ — повторюй у всіх трьох підходах]
{{PRODUCT_OR_BRAND}}, {{VISUAL_ELEMENTS_AVAILABLE}}, {{AD_MOOD}}

[ПІДХІД 1 — На основі продукту-героя]
{{PRODUCT_OR_BRAND}} product shot as the central hero subject, {{VISUAL_ELEMENTS_AVAILABLE}}, generous negative space reserved in {{COPY_ZONE}} for headline, body copy, and logo, {{AD_MOOD}}, full-bleed print advertisement layout, clean commercial photography --ar {{ASPECT_RATIO}}

[ПІДХІД 2 — На основі лайфстайл-сцени]
{{LIFESTYLE_CONTEXT}} featuring {{PRODUCT_OR_BRAND}} naturally in scene, {{AD_MOOD}}, generous negative space reserved in {{COPY_ZONE}} for headline, body copy, and logo, full-bleed print advertisement layout, lifestyle photography --ar {{ASPECT_RATIO}}

[ПІДХІД 3 — На основі графіки/типографіки]
Bold graphic composition built around {{GRAPHIC_MOTIF}}, {{PRODUCT_OR_BRAND}} product shown smaller and secondary within the composition, {{AD_MOOD}}, generous negative space reserved in {{COPY_ZONE}} for a large headline treatment, full-bleed print advertisement layout, graphic design poster style --ar {{ASPECT_RATIO}}
```

## Змінні
- `{{PRODUCT_OR_BRAND}}` — продукт чи бренд, що рекламується, описаний достатньо конкретно для рендерингу (не просто назва). Обов'язково.
- `{{VISUAL_ELEMENTS_AVAILABLE}}` — що реально доступно показати (сам продукт, його упаковка, конкретний візуальний актив) — обов'язково для Підходу 1, якому потрібен конкретний герой-обʼєкт, а не загальний стоковий продукт.
- `{{AD_MOOD}}` — тон кампанії (напр., «преміальний, мінімалістичний, впевнений» проти «теплий, грайливий, доступний»). Обов'язково.
- `{{COPY_ZONE}}` — де має розташовуватись зарезервоване місце (напр., «нижня третина, на всю ширину», «ліва третина, продукт праворуч») — обов'язково, щоб макет реально залишав придатне, правильно пропорційне місце під реальний текст надалі, оскільки на сам генератор зображень не варто покладатись у рендерингу фінального читабельного заголовка.
- `{{ASPECT_RATIO}}` — співвідношення сторін друкованого формату (напр., «4:5» для повної сторінки журналу, «2:3» для постера, «3:1» для білборда/зовнішньої реклами). Обов'язково.
- `{{LIFESTYLE_CONTEXT}}` — для Підходу 2: сцена чи оточення, у якому зʼявляється продукт (напр., «сонячна кухонна стільниця під час ранкового ритуалу»). Обов'язково для цього підходу.
- `{{GRAPHIC_MOTIF}}` — для Підходу 3: абстрактний графічний елемент, з якого будується композиція (напр., «сміливий діагональний розподіл кольорових блоків», «збільшений візерунок растру»). Обов'язково для цього підходу.

## Приклад
**Вхід:** `{{PRODUCT_OR_BRAND}}` = «банки холодного бренду Verve, матово-чорна банка із золотим логотипом-блискавкою» · `{{VISUAL_ELEMENTS_AVAILABLE}}` = «сама банка, краплі конденсату» · `{{AD_MOOD}}` = «сміливий, енергійний, впевнений» · `{{COPY_ZONE}}` = «нижня третина, на всю ширину» · `{{ASPECT_RATIO}}` = «4:5» · `{{LIFESTYLE_CONTEXT}}` = «велосипедист зупиняється під час поїздки на світанку, міська вулиця» · `{{GRAPHIC_MOTIF}}` = «сміливий діагональний розподіл кольорових блоків у чорному й золотому»

**Підхід 1 — На основі продукту-героя:**
```
Verve cold-brew coffee cans, matte black can with a gold lightning-bolt logo product shot as the central hero subject, the can itself, condensation droplets, generous negative space reserved in bottom third, full width for headline, body copy, and logo, bold, energetic, confident, full-bleed print advertisement layout, clean commercial photography --ar 4:5
```

**Підхід 2 — На основі лайфстайл-сцени:**
```
a cyclist pausing mid-ride at sunrise, city street featuring Verve cold-brew coffee cans, matte black can with a gold lightning-bolt logo naturally in scene, bold, energetic, confident, generous negative space reserved in bottom third, full width for headline, body copy, and logo, full-bleed print advertisement layout, lifestyle photography --ar 4:5
```

**Підхід 3 — На основі графіки/типографіки:**
```
Bold graphic composition built around a bold diagonal color-block split in black and gold, Verve cold-brew coffee cans, matte black can with a gold lightning-bolt logo product shown smaller and secondary within the composition, bold, energetic, confident, generous negative space reserved in bottom third, full width for a large headline treatment, full-bleed print advertisement layout, graphic design poster style --ar 4:5
```

## Поради та варіації
- Поєднуй з «Генератором варіантів превʼю для A/B-тестування» (`thumbnail-variant-generator-for-a-b-testing`, creative-and-visual, вже випущений) — прямий концептуальний аналог: та сама техніка зарезервованого місця й подібно структурований розподіл на три підходи, тут адаптований з відеопревʼю 16:9 до форматів друку під повне поле зі специфічними для друку співвідношеннями сторін.
- Зарезервоване місце — не відрендерений текст: перевір, що `{{COPY_ZONE}}` кожної концепції реально читається як порожній, читабельний негативний простір у цільовому розмірі друку, перш ніж передавати дизайнеру; додай реальний заголовок і основний текст у програмі верстки надалі, а не покладайся на генератор у рендерингу фінального друкарського тексту.
- Для форматів зовнішньої реклами/білбордів зокрема віддавай перевагу Підходу 1 чи 3 (один сильний фокальний елемент) над сценічною композицією Підходу 2 — насичена лайфстайл-сцена схильна читатись як візуальний шум на відстані й при швидкості перегляду, з якою такі формати реально сприймаються.

## Історія змін
- 1.0.0 (2026-09-06): Початкова версія.
