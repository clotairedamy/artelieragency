//! Avatar, separator, collapsible, and date picker.

use dioxus::prelude::*;

use crate::icons::Icon;

/// A soft circle with initials.
#[component]
pub fn AdsAvatar(
    #[props(into)] name: String,
    #[props(default = 40u32)] size: u32,
) -> Element {
    let initials = name
        .split_whitespace()
        .filter_map(|p| p.chars().next())
        .take(2)
        .collect::<String>()
        .to_uppercase();
    rsx! {
        span { class: "ads-avatar", "aria-hidden": "true", style: "width:{size}px;height:{size}px;font-size:{size * 4 / 10}px", "{initials}" }
    }
}

/// A horizontal rule — the whisper that separates sections.
#[component]
pub fn AdsSeparator() -> Element {
    rsx! { hr { class: "ads-separator", role: "separator" } }
}

/// A single collapsible, on native details/summary.
#[component]
pub fn AdsCollapsible(
    #[props(into)] title: String,
    #[props(optional)] open: bool,
    children: Element,
) -> Element {
    rsx! {
        details { class: "ads-collapsible", open: open,
            summary { "{title}" }
            div { class: "panel", {children} }
        }
    }
}

/// A single date well.
#[component]
pub fn AdsDatePicker(
    #[props(into, optional)] label: Option<String>,
    #[props(into, optional)] value: Option<String>,
    #[props(optional)] oninput: Option<EventHandler<FormEvent>>,
) -> Element {
    rsx! {
        div { class: "stack",
            if let Some(l) = &label { label { class: "field-label", "{l}" } }
            div { class: "date",
                Icon { name: "compass", size: 15 }
                input {
                    class: "date-input",
                    r#type: "date",
                    value: value,
                    oninput: move |e| { if let Some(h) = &oninput { h.call(e); } },
                }
            }
        }
    }
}
