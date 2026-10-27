//! Story section — a narrative with the rest one click away.

use dioxus::prelude::*;

use crate::ui::RevealHeading;

/// A narrative: a heading, the story, and the rest behind a toggle.
#[component]
pub fn StorySection(
    #[props(into)] heading: Vec<String>,
    #[props(into, optional)] body: Option<Vec<String>>,
    #[props(into, optional)] more: Option<Vec<String>>,
) -> Element {
    let mut expanded = use_signal(|| false);
    let body = body.unwrap_or_default();
    let more = more.unwrap_or_default();

    rsx! {
        section { class: "story",
            RevealHeading { lines: heading, size: "title".to_string() }
            div { class: "story-body",
                for p in &body { p { class: "body", "{p}" } }
            }
            if !more.is_empty() {
                button {
                    class: "btn",
                    r#type: "button",
                    "aria-expanded": if *expanded.read() { "true" } else { "false" },
                    onclick: move |_| {
                        let v = *expanded.read();
                        expanded.set(!v);
                    },
                    if *expanded.read() { "Read less" } else { "Read the rest" }
                }
                if *expanded.read() {
                    div { class: "story-more",
                        for p in &more { p { class: "body", "{p}" } }
                    }
                }
            }
        }
    }
}
