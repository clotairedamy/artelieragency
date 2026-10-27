//! Command palette — a filterable ⌘K list.

use dioxus::prelude::*;

use crate::icons::Icon;

/// One palette command.
#[derive(Clone, PartialEq)]
pub struct Command {
    pub id: String,
    pub group: String,
    pub label: String,
    pub icon: String,
    pub hint: Option<String>,
}

impl Command {
    #[must_use]
    pub fn new(id: impl Into<String>, group: impl Into<String>, label: impl Into<String>, icon: impl Into<String>) -> Self {
        Self { id: id.into(), group: group.into(), label: label.into(), icon: icon.into(), hint: None }
    }
    #[must_use]
    pub fn hint(mut self, hint: impl Into<String>) -> Self {
        self.hint = Some(hint.into());
        self
    }
}

/// Forgiving subsequence match: "dsys" finds "Design system".
fn matches(text: &str, q: &str) -> bool {
    let mut i = 0usize;
    let t = text.to_lowercase();
    for ch in q.to_lowercase().chars().filter(|c| !c.is_whitespace()) {
        match t[i..].find(ch) {
            Some(j) => i += j + 1,
            None => return false,
        }
    }
    true
}

/// The command palette. `open` is controlled; `onselect` emits the command id.
#[component]
pub fn CommandPalette(
    #[props(optional)] open: bool,
    #[props(into)] commands: Vec<Command>,
    #[props(optional)] onclose: Option<EventHandler<MouseEvent>>,
    #[props(optional)] onselect: Option<EventHandler<String>>,
) -> Element {
    let mut query = use_signal(|| String::new());
    let q = query.read();
    let qs = q.as_str();
    let filtered = commands
        .iter()
        .filter(|c| matches(&format!("{} {}", c.label, c.group), qs))
        .collect::<Vec<_>>();

    rsx! {
        if open {
            div { class: "scrim", onmousedown: move |e| { if let Some(h) = &onclose { h.call(e); } },
                div { class: "palette", role: "dialog", "aria-modal": "true", "aria-label": "Command palette",
                    div { class: "field",
                        Icon { name: "discovery", size: 20 }
                        input {
                            class: "palette-input",
                            r#type: "text",
                            placeholder: "Search sections, pages and actions…",
                            "aria-label": "Search",
                            value: "{qs}",
                            oninput: move |e| query.set(e.value()),
                        }
                        kbd { class: "kbd", "esc" }
                    }
                    div { class: "results", role: "listbox",
                        for c in &filtered {
                            button {
                                class: "row",
                                r#type: "button",
                                role: "option",
                                onclick: { let h = onselect.clone(); let id = c.id.clone(); move |_| { if let Some(h) = &h { h.call(id.clone()); } } },
                                span { class: "row-icon", Icon { name: c.icon.clone(), size: 18 } }
                                span { class: "row-label", "{c.label}" }
                                if let Some(hint) = &c.hint { span { class: "row-hint num", "{hint}" } }
                            }
                        }
                        if filtered.is_empty() { p { class: "empty body", "Nothing matches." } }
                    }
                }
            }
        }
    }
}
