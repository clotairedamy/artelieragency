//! Work list — the work as a list.

use dioxus::prelude::*;

use crate::icons::Icon;
use crate::ui::ProjectLogo;

/// One entry in the work list.
#[derive(Clone, PartialEq)]
pub struct WorkItem {
    pub name: String,
    pub kind: String,
    pub words: String,
    pub href: Option<String>,
}

impl WorkItem {
    #[must_use]
    pub fn new(name: impl Into<String>, kind: impl Into<String>, words: impl Into<String>) -> Self {
        Self { name: name.into(), kind: kind.into(), words: words.into(), href: None }
    }
    #[must_use]
    pub fn href(mut self, href: impl Into<String>) -> Self {
        self.href = Some(href.into());
        self
    }
}

/// The work as a list: a mark, what it is in a line, and where it lives.
#[component]
pub fn WorkList(
    #[props(into)] items: Vec<WorkItem>,
) -> Element {
    rsx! {
        ul { class: "wl",
            for p in &items {
                li { class: "wl-row",
                    a { class: "wl-link", href: p.href.as_deref().unwrap_or("#"),
                        ProjectLogo { word: p.name.chars().next().map_or_else(String::new, |c| c.to_string()), size: 48 }
                        span { class: "wl-text",
                            span { class: "wl-kind", "{p.kind}" }
                            span { class: "wl-name", "{p.name}" }
                            span { class: "wl-words", "{p.words}" }
                        }
                        span { class: "wl-go",
                            "Read the case study"
                            Icon { name: "arrow", size: 15 }
                        }
                    }
                }
            }
        }
    }
}
