---
id: motion-graphics-style-frame-generator
title: Генератор стильових кадрів для моушн-графіки
category: creative-and-visual
tags: [concept-art, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: advanced
version: 1.0.0
status: stable
language: uk
last_updated: 2026-09-06
---

## Опис
Будує базову візуальну систему для моушн-графіки (кольорова палітра, мова форм/ліній, обробка типографіки, натяк на характер руху) плюс невеликий набір ключових стильових кадрів — титульна/вступна картка, кадр з даними, перехідний кадр і фінальна картка/CTA — закріплюючи вигляд моушн-графічного проєкту до початку власне анімаційної роботи. Відрізняється від наративної розкадровки: тут немає повторюваного персонажа чи сюжетної точки, лише графічна дизайн-система, виражена статичними кадрами, які аніматор чи моушн-дизайнер може погодити й розвинути.

## Коли використовувати
- Починаєш проєкт моушн-графіки (пояснювальне відео, титульна послідовність, брендовий інтро, дата-віз сегмент) і потрібно закріпити візуальний стиль до початку анімації, оскільки перестилізація після початку анімаційної роботи коштує дорого.
- Стейкхолдерам треба погодити «вигляд» — палітру, іконографію, типографіку — для моушн-проєкту, а статичні кадри швидше й дешевше ітерувати, ніж тестові анімації.
- Отримав моушн-графічне відео чи стайлборд, що відчувався неузгодженим між сегментами (титульна картка проти екрана з даними проти фіналу), і потрібна точніша базова специфікація, щоб їх об'єднати.

## Промпт

```
[ВІЗУАЛЬНА СИСТЕМА — повторюй дослівно в кожному стильовому кадрі]
{{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}

[КАДР 1 — Титульна/вступна картка]
Title card design, "{{TITLE_TEXT}}", {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}

[КАДР 2 — Кадр з даними]
Data visualization frame showing {{DATA_CONCEPT}}, {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}

[КАДР 3 — Перехідний кадр]
Abstract transition frame built from {{TRANSITION_MOTIF}}, {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}

[КАДР 4 — Фінальна картка/CTA]
Outro card design, "{{CTA_TEXT}}", {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}
```

## Змінні
- `{{COLOR_PALETTE}}` — конкретна, названа палітра (напр., «electric violet, deep navy, and a single warm coral accent»), незмінна в усіх чотирьох кадрах. Обов'язково.
- `{{SHAPE_AND_LINE_LANGUAGE}}` — графічна лексика (напр., «rounded geometric shapes, thick consistent line weight, no gradients»). Обов'язково.
- `{{TYPOGRAPHY_TREATMENT}}` — як має виглядати й поводитись типографіка (напр., «bold condensed sans-serif, oversized, tight tracking»). Обов'язково для кадрів з текстом.
- `{{MOTION_IMPLIED_STYLE}}` — як стиль має читатись, попри те, що це статичні кадри (напр., «implies snappy, elastic motion», «implies slow, floating drift») — це підказує аніматору задуманий характер руху, не лише статичний вигляд. Обов'язково.
- `{{TITLE_TEXT}}` / `{{CTA_TEXT}}` — реальний текстовий вміст для титульної й фінальної карток. Обов'язково для цих двох кадрів.
- `{{DATA_CONCEPT}}` — що має візуалізувати кадр з даними (напр., «a rising bar chart comparing three growth metrics»). Обов'язково для Кадру 2.
- `{{TRANSITION_MOTIF}}` — графічний мотив, з якого будується перехід (напр., «overlapping expanding circles», «a shattering grid»). Обов'язково для Кадру 3.
- `{{ASPECT_RATIO}}` — незмінне в усьому наборі, відповідає фінальному формату доставки (напр., «16:9» для горизонтального пояснювального відео, «9:16» для вертикальної соцмережевої версії). Обов'язково.

## Приклад
**Вхід:** `{{COLOR_PALETTE}}` = «electric violet, deep navy, single warm coral accent» · `{{SHAPE_AND_LINE_LANGUAGE}}` = «rounded geometric shapes, thick consistent line weight, no gradients» · `{{TYPOGRAPHY_TREATMENT}}` = «bold condensed sans-serif, oversized, tight tracking» · `{{MOTION_IMPLIED_STYLE}}` = «implies snappy, elastic motion» · `{{TITLE_TEXT}}` = «Meet Flowpath» · `{{DATA_CONCEPT}}` = «a rising line chart showing weekly active users climbing over 6 months» · `{{TRANSITION_MOTIF}}` = «overlapping expanding circles» · `{{CTA_TEXT}}` = «Try it free» · `{{ASPECT_RATIO}}` = «16:9»

**Кадр 1 — Титульна/вступна картка:**
```
Title card design, "Meet Flowpath", electric violet, deep navy, single warm coral accent, rounded geometric shapes, thick consistent line weight, no gradients, bold condensed sans-serif, oversized, tight tracking, implies snappy, elastic motion, motion graphics style frame, flat vector design --ar 16:9
```

**Кадр 2 — Кадр з даними:**
```
Data visualization frame showing a rising line chart showing weekly active users climbing over 6 months, electric violet, deep navy, single warm coral accent, rounded geometric shapes, thick consistent line weight, no gradients, bold condensed sans-serif, oversized, tight tracking, implies snappy, elastic motion, motion graphics style frame, flat vector design --ar 16:9
```

**Кадр 4 — Фінальна картка/CTA:**
```
Outro card design, "Try it free", electric violet, deep navy, single warm coral accent, rounded geometric shapes, thick consistent line weight, no gradients, bold condensed sans-serif, oversized, tight tracking, implies snappy, elastic motion, motion graphics style frame, flat vector design --ar 16:9
```

## Поради та варіації
- Поєднуй з «Послідовністю промптів для розкадровки короткого відео» (`short-form-video-storyboard-prompt-sequence`, creative-and-visual, вже випущений) як наративним аналогом: той промпт веде історію з повторюваним персонажем крізь кадри у стилі живої зйомки, а цей — графічну дизайн-систему взагалі без наскрізного сюжету. Використовуй розкадровку, коли проєкт має персонажні чи знято-орієнтовані точки, і цей промпт — коли він абстрактний/графічно-орієнтований.
- Ці кадри — стильові референси для аніматора, не сама анімація — передай погоджений набір тому, хто робитиме проєкт, разом зі словесним описом задуму `{{MOTION_IMPLIED_STYLE}}`, оскільки самий статичний кадр не може задати таймінг, easing чи механіку переходів.
- Якщо якийсь кадр порушує палітру чи мову форм (поширена точка розбіжності, коли `{{DATA_CONCEPT}}` чи `{{TRANSITION_MOTIF}}` тягне до іншої візуальної метафори, ніж решта набору), перегенеровуй його одразу поруч із вже погодженим кадром, а не окремо, щоб розбіжність було видно одразу.

## Історія змін
- 1.0.0 (2026-09-06): Початкова версія.
