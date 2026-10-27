//! Wordmark — the name, set small.

use dioxus::prelude::*;

/// The wordmark. No mark beside it: the word is the logo.
#[component]
pub fn Wordmark(
    #[props(into, optional)] text: Option<String>,
    #[props(default = 18u32)] size: u32,
) -> Element {
    let text = text.unwrap_or_else(|| "Artelier".to_string());
    rsx! {
        span { class: "wm", style: "font-size:{size}px", "{text}" }
    }
}
