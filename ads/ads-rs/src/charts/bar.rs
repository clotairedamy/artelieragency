//! Horizontal bar chart — value maps to luminance as well as length.

use dioxus::prelude::*;

/// A bar chart where value maps to luminance as well as height.
#[component]
pub fn AdsBars(
    #[props(into)] data: Vec<(String, f32)>,
) -> Element {
    let max = data.iter().map(|(_, v)| *v).fold(1.0f32, f32::max);
    let rows = data
        .iter()
        .map(|(label, value)| {
            let w = value / max * 100.0;
            let o = 0.35 + value / max * 0.65;
            (label, value, w, o)
        })
        .collect::<Vec<_>>();
    rsx! {
        div { class: "bars",
            for (label, value, w, o) in &rows {
                div { class: "row",
                    span { class: "lab", "{label}" }
                    span { class: "track",
                        span { class: "bar", style: "width:{w}%;opacity:{o}" }
                    }
                    span { class: "num val", "{value}" }
                }
            }
        }
    }
}
