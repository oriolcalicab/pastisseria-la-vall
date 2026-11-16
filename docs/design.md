# Disseny de La Vall

Els mockups de totes les pàgines (botiga, comanda, compte, avisos i admin), en escriptori i en mòbil, són a Figma:

**[Mockups de La Vall a Figma](https://www.figma.com/design/CBgllu3iKbRGdcfgLQ7qPE)**

L'estil triat és l'**opció A: crema i xocolata**.

## Colors

| Ús | Color |
| --- | --- |
| Text | `#3B2417` |
| Text secundari | `#6B5344` |
| Fons | `#FBF7F1` |
| Botons | `#4A2C1D` (hover `#33200F`) |
| Etiquetes | `#F1E6D8` |
| Línies | `#E8DED2` |
| Accent | `#8F5426` |
| Vores dels camps | `#8C7464` |

## Tipografia

- Títols: **Cormorant Garamond** (Google Fonts).
- Text: **Inter** (Google Fonts).

## Formes

- Botons arrodonits (`border-radius: 999px`).
- Targetes i imatges amb cantonades de 14 a 20 px.
- Etiquetes dietètiques en forma de pastilla, amb fons `#F1E6D8`.

## Mida

- Escriptori: contingut fins a 1320 px d'amplada.
- Mòbil: fins a 767 px, una sola columna i menú desplegable. A partir de 768 px, el menú de l'escriptori.

## Accessibilitat: contrast dels colors

Comprovat amb la fórmula de contrast de les WCAG 2.2 (nivell AA: 4,5:1 per al text i 3:1 per a les vores dels controls).

| Combinació | Contrast |
| --- | --- |
| Text xocolata `#3B2417` sobre crema `#FBF7F1` | 13,56:1 |
| Text mocha `#6B5344` sobre crema / blanc / nata | 6,68 / 7,13 / 5,79 |
| Text caramel `#8F5426` sobre crema / blanc / nata | 5,68 / 6,06 / 4,92 |
| Blanc sobre el botó cocoa `#4A2C1D` | 12,58:1 |
| Xocolata sobre el botó nata `#F1E6D8` | 11,75:1 |
| Daurat `#E3C5A3` i crema sobre el fons fosc de la portada `#100D0C` | 11,78 / 18,14 |
| Blanc sobre els colors d'estat del calendari | 5,02 – 7,56 |
| Vermell dels errors `#B91C1C` sobre crema | 6,06:1 |
| Vora dels camps i botons `#8C7464` sobre crema | 4,10:1 |

Les vores `#E8DED2` només es fan servir a les targetes, perquè són decoratives. Els camps de formulari porten la vora `#8C7464`.
