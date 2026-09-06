---
id: texture-material-study-prompt-set
title: Набір промптів для дослідження текстур/матеріалів
category: creative-and-visual
tags: [illustration, photography, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: beginner
version: 1.0.0
status: stable
language: uk
last_updated: 2026-09-06
---

## Опис
Генерує невеликий набір промптів для дослідження матеріалу крупним планом — наприклад, тканинне плетіння, шліфований метал чи текстура деревини, показані в кількох варіантах обробки чи стану — для описаної поверхні, створюючи референсні/мудборд-якісні макрозображення текстури, а не готовий знімок продукту чи середовища.

## Коли використовувати
- Будуєш мудборд матеріалів для продукту, інтер'єру чи ігрового асету і потрібні референсні зображення крупним планом, що показують, як конкретний матеріал насправді має виглядати й відчуватись.
- Хочеш порівняти кілька варіацій обробки чи стану того самого базового матеріалу (напр., матовий проти глянцевого проти зношеного) перед тим, як зупинитись на напрямку.
- Потрібні референсні зображення текстури для дизайнера чи 3D-художника, за якими орієнтуватись, а не готовий відрендерений об'єкт, який цей матеріал зрештою покриватиме.

## Промпт

```
[БАЗОВИЙ ОПИС МАТЕРІАЛУ — повторно використовуй дослівно у кожному варіанті]
{{MATERIAL}}, {{MATERIAL_COLOR}}

[ВАРІАНТ — змінюй лише цей рядок для кожного зображення]
{{FINISH_OR_CONDITION}}

Повний промпт для варіанту: extreme close-up macro texture study of {{MATERIAL}}, {{MATERIAL_COLOR}}, {{FINISH_OR_CONDITION}}, {{LIGHTING_DIRECTION}}, texture filling the entire frame, no object silhouette visible, only surface detail, ultra high detail, shallow depth of field --ar 1:1
```

## Змінні
- `{{MATERIAL}}` — конкретний матеріал, що досліджується (напр., «coarse linen weave fabric», «brushed stainless steel», «raw oak wood grain»). Обов'язково.
- `{{MATERIAL_COLOR}}` — конкретний колір чи тон обробки цього матеріалу. Обов'язково.
- `{{FINISH_OR_CONDITION}}` — те єдине, що змінюється в кожному зображенні набору (напр., «matte finish, slightly worn», «high-gloss lacquered finish», «weathered and sun-bleached»). Обов'язково.
- `{{LIGHTING_DIRECTION}}` — лишається однаковим у всіх варіантах набору (напр., «raking side light emphasizing texture depth»). Обов'язково — читабельність текстури сильно залежить від кута світла, тож це найважливіша змінна для набору, що має читатись як одне дослідження.

## Приклад
**Вхід:** `{{MATERIAL}}` = «грубе лляне плетене полотно» · `{{MATERIAL_COLOR}}` = «натуральний нефарбований вівсяний відтінок» · `{{LIGHTING_DIRECTION}}` = «ковзне бокове світло зліва, що підкреслює глибину текстури плетіння»

**Варіант 1 — Сирий, матовий:**
```
extreme close-up macro texture study of coarse linen weave fabric, natural undyed oatmeal tone, matte finish, tightly woven, slightly irregular hand-loomed texture, raking side light from the left, emphasizing the weave's texture depth, texture filling the entire frame, no object silhouette visible, only surface detail, ultra high detail, shallow depth of field --ar 1:1
```

**Варіант 2 — Зношений:**
```
extreme close-up macro texture study of coarse linen weave fabric, natural undyed oatmeal tone, weathered and sun-faded, a few loose frayed fibers, raking side light from the left, emphasizing the weave's texture depth, texture filling the entire frame, no object silhouette visible, only surface detail, ultra high detail, shallow depth of field --ar 1:1
```

## Поради та варіації
- Тримай `{{LIGHTING_DIRECTION}}` однаковим у всіх варіантах набору — ковзне чи кутове світло реально виявляє глибину текстури; пласке фронтальне освітлення сплющує тонку деталізацію поверхні й зводить нанівець сенс дослідження матеріалу.
- Поєднуй із «Набором промптів мудборду концепт-арту середовища» (creative-and-visual, вже випущений), коли дослідження матеріалу має вирости в реальне середовище: спочатку зафіксуй вигляд матеріалу тут, потім перенеси точне формулювання `{{MATERIAL}}` і `{{MATERIAL_COLOR}}` у поле `{{LOCATION_DESCRIPTION}}` того промпту, щоб поверхня читалась консистентно і в макро-, і в повномасштабній сцені.
- Це референсні дослідження, а не безшовні тайлові текстурні карти — якщо потрібна справді тайлова текстура для 3D-роботи, спеціалізований інструмент генерації текстур, розрахований на тайлінг, підійде краще за одиночний кадр із генератора зображень.

## Історія змін
- 1.0.0 (2026-09-06): Початкова версія.
