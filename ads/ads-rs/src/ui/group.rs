//! Segmented control, tabs, and menu.

use dioxus::prelude::*;

use crate::icons::Icon;

/// An option for a segmented control or tab row.
#[derive(Clone, PartialEq)]
pub struct SegOption {
    pub label: String,
    pub value: String,
}

impl SegOption {
    #[must_use]
    pub fn new(label: impl Into<String>, value: impl Into<String>) -> Self {
        Self { label: label.into(), value: value.into() }
    }
}

/// A small set of mutually exclusive views, all visible at once.
#[component]
pub fn AdsSegmented(
    #[props(into)] options: Vec<SegOption>,
    #[props(into, optional)] selected: Option<String>,
    #[props(optional)] onselect: Option<EventHandler<String>>,
) -> Element {
    let current = selected.unwrap_or_default();
    rsx! {
        div { class: "ads-segmented", role: "group",
            for o in &options {
                button {
                    r#type: "button",
                    class: if o.value == current { "is-on" } else { "" },
                    "aria-pressed": if o.value == current { "true" } else { "false" },
                    onclick: {
                        let v = o.value.clone();
                        move |_| { if let Some(h) = &onselect { h.call(v.clone()); } }
                    },
                    "{o.label}"
                }
            }
        }
    }
}

/// Views of one dataset. The underline is the accent's only appearance in a
/// nav context.
#[component]
pub fn AdsTabs(
    #[props(into)] tabs: Vec<SegOption>,
    #[props(into, optional)] selected: Option<String>,
    #[props(optional)] onselect: Option<EventHandler<String>>,
) -> Element {
    let current = selected.unwrap_or_default();
    rsx! {
        div { class: "ads-tabs", role: "tablist",
            for t in &tabs {
                button {
                    r#type: "button",
                    role: "tab",
                    class: if t.value == current { "is-on" } else { "" },
                    "aria-selected": if t.value == current { "true" } else { "false" },
                    onclick: {
                        let v = t.value.clone();
                        move |_| { if let Some(h) = &onselect { h.call(v.clone()); } }
                    },
                    "{t.label}"
                }
            }
        }
    }
}

/// A menu item.
#[derive(Clone, PartialEq)]
pub struct MenuItem {
    pub label: String,
    pub icon: Option<String>,
    pub divider: bool,
}

impl MenuItem {
    #[must_use]
    pub fn item(label: impl Into<String>) -> Self {
        Self { label: label.into(), icon: None, divider: false }
    }
    #[must_use]
    pub fn with_icon(label: impl Into<String>, icon: impl Into<String>) -> Self {
        Self { label: label.into(), icon: Some(icon.into()), divider: false }
    }
    #[must_use]
    pub fn divider() -> Self {
        Self { label: String::new(), icon: None, divider: true }
    }
}

/// Row actions and overflow — everything a reader can do to one record.
#[component]
pub fn AdsMenu(
    #[props(into)] items: Vec<MenuItem>,
    #[props(optional)] onaction: Option<EventHandler<String>>,
) -> Element {
    rsx! {
        div { class: "ads-menu", role: "menu",
            for it in &items {
                if it.divider {
                    hr {}
                } else {
                    button {
                        r#type: "button",
                        role: "menuitem",
                        onclick: {
                            let l = it.label.clone();
                            move |_| { if let Some(h) = &onaction { h.call(l.clone()); } }
                        },
                        if let Some(ic) = &it.icon { Icon { name: ic.clone(), size: 15 } }
                        "{it.label}"
                    }
                }
            }
        }
    }
}
