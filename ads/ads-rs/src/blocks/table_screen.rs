//! Table screen — header, tabs, filter bar, grid, pagination.

use dioxus::prelude::*;

use crate::icons::Icon;
use crate::ui::{AdsDataGrid, AdsTabs, GridColumn, SegOption};

/// The arrangement that carries most of the working hours in any data product.
#[component]
pub fn TableScreen(
    #[props(into)] title: String,
    #[props(into, optional)] count: Option<String>,
    #[props(into, default = "Export CSV".to_string())] action_label: String,
    #[props(into, optional)] tabs: Option<Vec<SegOption>>,
    #[props(into)] columns: Vec<GridColumn>,
    #[props(into)] rows: Vec<Vec<String>>,
) -> Element {
    let tabs = tabs.unwrap_or_default();
    rsx! {
        div { class: "card screen",
            header { class: "head",
                div {
                    h4 { class: "title", "{title}" }
                    if let Some(c) = &count { span { class: "dim num", "{c}" } }
                }
                button { class: "btn btn-accent", r#type: "button", "{action_label}" }
            }
            if !tabs.is_empty() {
                AdsTabs { tabs: tabs.clone() }
            }
            div { class: "bar",
                div { class: "ads-search",
                    Icon { name: "compass", size: 16 }
                    input { class: "ads-field", r#type: "search", placeholder: "Filter by URL…", "aria-label": "Filter" }
                }
            }
            AdsDataGrid { columns: columns, rows: rows }
        }
    }
}
