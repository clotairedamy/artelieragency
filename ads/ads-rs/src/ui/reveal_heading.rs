//! Reveal heading — a heading, one block per line.

use dioxus::prelude::*;

/// A heading rendered one block per line, so a deliberate break lands where it
/// was written. Always an `h2` in Dioxus.
#[component]
pub fn RevealHeading(
    #[props(into)] lines: Vec<String>,
    #[props(into, default = "title".to_string())] size: String,
) -> Element {
    let class = format!("rv rv--{size}");
    rsx! {
        h2 { class: "{class}",
            for line in &lines { span { class: "rv-line", "{line}" } }
        }
    }
}
