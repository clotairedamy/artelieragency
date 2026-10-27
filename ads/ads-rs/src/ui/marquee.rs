//! Marquee — a scrolling band of pills.

use dioxus::prelude::*;

/// A scrolling band of pills, for showing breadth quietly. Pauses on hover and
/// stops under reduced motion (CSS).
#[component]
pub fn Marquee(
    #[props(into)] items: Vec<String>,
) -> Element {
    rsx! {
        div { class: "marquee",
            div { class: "track",
                div { class: "lane",
                    for item in &items { span { class: "item", "{item}" } }
                }
                div { class: "lane", "aria-hidden": "true",
                    for item in &items { span { class: "item", "{item}" } }
                }
            }
        }
    }
}
