//! Local time — the time in the studio, and whether anyone is at the desk.

use dioxus::prelude::*;

/// A status line: city, live time, and whether the studio is open.
#[component]
pub fn LocalTime(
    #[props(into)] city: String,
    #[props(into)] time: String,
    #[props(default = true)] open: bool,
    #[props(into, optional)] state: Option<String>,
) -> Element {
    rsx! {
        p { class: "lt",
            span { class: if open { "lt-dot" } else { "lt-dot is-off" }, "aria-hidden": "true" }
            span { "{city}" }
            time { class: "lt-time num", "{time}" }
            if let Some(s) = &state { span { class: "lt-state", "{s}" } }
        }
    }
}
