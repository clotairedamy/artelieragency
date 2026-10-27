//! Heatmap — a density grid. Value maps to opacity.

use dioxus::prelude::*;

/// A density grid. Value maps to opacity — the channel a monochrome palette
/// has left.
#[component]
pub fn AdsHeatmap(
    #[props(default = 16u32)] cols: u32,
    #[props(default = 5u32)] rows: u32,
) -> Element {
    let cells = (0..rows)
        .map(|y| {
            (0..cols)
                .map(|x| {
                    let wave = (x as f32 / 3.1 + y as f32 / 1.7).sin() * 0.5 + 0.5;
                    let drift = ((x as f32 * 7.0 + y as f32 * 13.0) / 11.0).sin() * 0.5 + 0.5;
                    ((wave * 0.65 + drift * 0.35) * 4.0).round() as u8
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    rsx! {
        div { class: "heat", "aria-hidden": "true",
            for row in &cells {
                div { class: "heat-row",
                    for v in row {
                        span { class: "cell", style: "opacity:{0.08 + (*v as f32) * 0.22}" }
                    }
                }
            }
        }
    }
}
