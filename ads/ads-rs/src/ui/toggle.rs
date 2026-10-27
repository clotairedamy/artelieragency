//! Toggle button and button group.

use dioxus::prelude::*;

use crate::icons::Icon;

/// A single toggle button — a setting that flips and stays that way.
#[component]
pub fn AdsToggle(
    #[props(optional)] checked: bool,
    #[props(into, optional)] icon: Option<String>,
    #[props(default = 16u32)] size: u32,
    #[props(optional)] onchange: Option<EventHandler<bool>>,
    children: Element,
) -> Element {
    rsx! {
        button {
            r#type: "button",
            class: if checked { "ads-toggle is-on" } else { "ads-toggle" },
            "aria-pressed": if checked { "true" } else { "false" },
            onclick: {
                let h = onchange.clone();
                move |_| { if let Some(h) = &h { h.call(!checked); } }
            },
            if let Some(n) = &icon { Icon { name: n.clone(), size } }
            {children}
        }
    }
}

/// A button group — a set of toggle buttons, several active at once.
#[derive(Clone, PartialEq)]
pub struct ToggleOption {
    pub label: String,
    pub value: String,
}

impl ToggleOption {
    #[must_use]
    pub fn new(label: impl Into<String>, value: impl Into<String>) -> Self {
        Self { label: label.into(), value: value.into() }
    }
}

#[component]
pub fn AdsToggleGroup(
    #[props(into)] options: Vec<ToggleOption>,
    #[props(into, optional)] selected: Option<Vec<String>>,
    #[props(optional)] onchange: Option<EventHandler<Vec<String>>>,
) -> Element {
    let selected = selected.unwrap_or_default();
    rsx! {
        div { class: "ads-segmented", role: "group",
            for o in &options {
                button {
                    r#type: "button",
                    class: if selected.contains(&o.value) { "is-on" } else { "" },
                    "aria-pressed": if selected.contains(&o.value) { "true" } else { "false" },
                    onclick: {
                        let v = o.value.clone();
                        let sel = selected.clone();
                        let h = onchange.clone();
                        move |_| {
                            let mut next = sel.clone();
                            if next.contains(&v) { next.retain(|x| x != &v); } else { next.push(v.clone()); }
                            if let Some(h) = &h { h.call(next); }
                        }
                    },
                    "{o.label}"
                }
            }
        }
    }
}
