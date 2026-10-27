//! Project logo — a word on a small inset tile.

use dioxus::prelude::*;

/// A client's word on a small inset tile, always in the ink.
#[component]
pub fn ProjectLogo(
    #[props(into)] word: String,
    #[props(default = 76u32)] size: u32,
) -> Element {
    rsx! {
        span { class: "pl", style: "--s:{size}px",
            span { class: "pl-word", "{word}" }
        }
    }
}
