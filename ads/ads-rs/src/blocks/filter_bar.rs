//! Filter bar & saved views.

use dioxus::prelude::*;

use crate::icons::Icon;
use crate::ui::{AdsSegmented, AdsTag, SegOption};

/// One row, above the data, holding every control that changes what is shown.
#[component]
pub fn FilterBar(
    #[props(into, optional)] placeholder: Option<String>,
    #[props(into, optional)] tags: Option<Vec<String>>,
    #[props(into, optional)] segments: Option<Vec<SegOption>>,
) -> Element {
    let placeholder = placeholder.unwrap_or_else(|| "Filter by URL…".to_string());
    let tags = tags.unwrap_or_default();
    let segments = segments.unwrap_or_else(|| {
        vec![
            SegOption::new("All", "all"),
            SegOption::new("2xx", "2xx"),
            SegOption::new("4xx", "4xx"),
        ]
    });
    rsx! {
        div { class: "stack",
            div { class: "bar",
                div { class: "ads-search",
                    Icon { name: "compass", size: 16 }
                    input { class: "ads-field", r#type: "search", placeholder: placeholder, "aria-label": "Filter" }
                }
                div { class: "ads-daterange",
                    span { class: "num", "30d" }
                    span { class: "sep", "→" }
                    span { class: "num", "now" }
                }
                AdsSegmented { options: segments }
            }
            div { class: "saved",
                span { class: "ads-label", "Saved" }
                for t in &tags {
                    AdsTag { label: t.clone() }
                }
                button { class: "btn btn-quiet", r#type: "button",
                    Icon { name: "plus", size: 15 }
                    "Save this view"
                }
            }
        }
    }
}
