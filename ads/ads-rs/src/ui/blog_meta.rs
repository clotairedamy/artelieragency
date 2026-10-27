//! Blog meta — a post's tag, date and reading time.

use dioxus::prelude::*;

/// A post's metadata row.
#[component]
pub fn BlogMeta(
    #[props(into)] tag: String,
    #[props(into)] date: String,
    #[props(optional)] reading_time: Option<u32>,
) -> Element {
    rsx! {
        div { class: "meta",
            span { class: "tag", "{tag}" }
            time { "{date}" }
            if let Some(rt) = reading_time { span { "· {rt} min read" } }
        }
    }
}
