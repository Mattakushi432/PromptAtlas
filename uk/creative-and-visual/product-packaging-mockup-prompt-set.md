---
id: product-packaging-mockup-prompt-set
title: Набір промптів для мокапів пакування продукту
category: creative-and-visual
tags: [product-mockups, product-design, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: uk
last_updated: 2026-09-06
---

## Опис
Будує базовий опис пакування плюс три варіанти промптів під конкретні ракурси — фронтальний, тричетвертний героїчний та контекст на полиці магазину — для описаного пакування продукту, щоб рецензент бачив те саме пакування з ракурсів, які реально потрібні для питчу пакування, а не єдиний плаский фронтальний знімок.

## Коли використовувати
- Презентуєш напрямок дизайну пакування й потрібно більше за один фронтальний знімок, щоб продати концепцію — героїчний ракурс і реалістичний знімок на полиці показують, як пакування насправді читається в реальному середовищі.
- Питчиш концепцію пакування клієнту чи стейкхолдеру і хочеш «готовий до полиці» контекстний образ поряд із чистими студійними видами.
- Попередні окремі спроби фронтального, ракурсного й поличного знімків не виглядали як та сама коробка — різні пропорції, різне розташування етикетки, різне сприйняття кольору між ними.

## Промпт

```
[БАЗОВИЙ ОПИС ПАКУВАННЯ — повторно використовуй дослівно у кожному ракурсі]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}

[РАКУРС 1 — Фронтальний]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}, straight-on front view, centered composition, on plain white studio background, soft even lighting, commercial product photography, ultra high detail --ar 1:1

[РАКУРС 2 — Тричетвертний героїчний]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}, three-quarter angle view showing front and side panel, slight downward camera angle, on plain white studio background, soft directional lighting with subtle shadow, commercial product photography, ultra high detail --ar 4:5

[РАКУРС 3 — Контекст на полиці магазину]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}, positioned on a retail store shelf among {{SHELF_CONTEXT}}, realistic retail lighting, shallow depth of field with shelf background softly blurred, commercial photography --ar 16:9
```

## Змінні
- `{{PRODUCT_NAME}}` — назва продукту/бренду, як вона з'являється на пакуванні. Обов'язково.
- `{{PACKAGING_TYPE}}` — фізична структура пакування (напр., «a rectangular cardboard box», «a cylindrical tin», «a stand-up resealable pouch»). Обов'язково — структура впливає на те, як має читатись кожен ракурс.
- `{{DESIGN_DESCRIPTION}}` — реальний візуальний дизайн пакування: розташування логотипу, зображення, трактування типографіки, описані конкретно, а не розмито. Обов'язково.
- `{{BRAND_COLORS}}` — конкретна названа палітра (напр., «matte forest green with a metallic gold foil logo»). Обов'язково — повторюється дослівно у всіх трьох ракурсах, щоб пакування виглядало тим самим об'єктом.
- `{{SHELF_CONTEXT}}` — лише для Ракурсу 3: що оточує його на полиці (напр., «similar competing snack boxes, softly blurred», «other products from the same line, in a neat row»). Обов'язково для цього ракурсу.

## Приклад
**Вхід:** `{{PRODUCT_NAME}}` = «Northbound Granola» · `{{PACKAGING_TYPE}}` = «стоячий пакет із крафт-паперу із застібкою, що можна закривати повторно» · `{{DESIGN_DESCRIPTION}}` = «намальована вручну ілюстрація гірського хребта у верхній третині, назва бренду жирним серифом під нею, невеликий блок з інформацією про поживну цінність у нижньому куті» · `{{BRAND_COLORS}}` = «натуральний крафтовий коричневий фон із темно-зеленим лісовим і одним акцентом гірчичного жовтого» · `{{SHELF_CONTEXT}}` = «інші коробки з гранолою та снек-барами, м'яко розмиті»

**Ракурс 1 — Фронтальний:**
```
Northbound Granola packaging, a stand-up resealable kraft-paper pouch, a hand-drawn mountain range illustration across the top third, brand name in a bold serif below it, a small nutrition callout in the lower corner, natural kraft brown base with deep forest green and a single mustard-yellow accent, straight-on front view, centered composition, on plain white studio background, soft even lighting, commercial product photography, ultra high detail --ar 1:1
```

**Ракурс 3 — Контекст на полиці магазину:**
```
Northbound Granola packaging, a stand-up resealable kraft-paper pouch, a hand-drawn mountain range illustration across the top third, brand name in a bold serif below it, a small nutrition callout in the lower corner, natural kraft brown base with deep forest green and a single mustard-yellow accent, positioned on a retail store shelf among other granola and snack bar boxes, softly blurred, realistic retail lighting, shallow depth of field with shelf background softly blurred, commercial photography --ar 16:9
```

## Поради та варіації
- Тримай БАЗОВИЙ ОПИС ПАКУВАННЯ дослівно однаковим у всіх трьох ракурсах — мають змінюватись лише терміни ракурсу/контексту. Це та сама дисципліна консистентності, що й у «Генераторі промптів для набору ізометричних іконок» та «Наборі промптів мудборду концепт-арту середовища» (creative-and-visual, вже випущені), застосована тут до одного дизайну пакування замість набору іконок чи локації.
- Поєднуй із «Конструктором промпту для фотореалістичного знімка продукту» (creative-and-visual, вже випущений), коли сам продукт — не лише його пакування — теж потребує героїчного знімка: той промпт контролює лексику фотореалізму (налаштування освітлення, об'єктив, камера) для одного зображення продукту, а цей тримає один дизайн пакування незмінним у ракурсах, які реально потрібні для рецензії пакування.
- Розглядай ці зображення як мокапи стадії питчу/дослідження, а не готові до друку файли пакування — реальне виробниче пакування потребує справжнього вирубного штампу (dieline), випуску під обріз і кольороподілу, готового до друку, чого генератор зображень не створює.

## Історія змін
- 1.0.0 (2026-09-06): Початкова версія.
