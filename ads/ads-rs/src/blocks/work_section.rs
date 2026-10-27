//! Work section — the work as a grid of project cards.

use dioxus::prelude::*;

/// One project card.
#[derive(Clone, PartialEq)]
pub struct WorkCard {
    pub name: String,
    pub kind: String,
    pub description: String,
    pub tags: Vec<String>,
    pub href: Option<String>,
}

impl WorkCard {
    #[must_use]
    pub fn new(name: impl Into<String>, kind: impl Into<String>, description: impl Into<String>) -> Self {
        Self { name: name.into(), kind: kind.into(), description: description.into(), tags: Vec::new(), href: None }
    }
    #[must_use]
    pub fn tags(mut self, tags: Vec<String>) -> Self {
        self.tags = tags;
        self
    }
    #[must_use]
    pub fn href(mut self, href: impl Into<String>) -> Self {
        self.href = Some(href.into());
        self
    }
}

/// A grid of project cards: kind, name, description, and tags.
#[component]
pub fn WorkSection(
    #[props(into)] items: Vec<WorkCard>,
) -> Element {
    rsx! {
        section { class: "work",
            div { class: "work-grid",
                for p in &items {
                    article { class: "work-card card",
                        span { class: "card-eyebrow", "{p.kind}" }
                        div { class: "card-title-row",
                            h3 { class: "card-name", "{p.name}" }
                            if let Some(h) = &p.href {
                                a { class: "card-link", href: "{h}", target: "_blank", rel: "noopener", "Live ↗" }
                            }
                        }
                        p { class: "card-desc", "{p.description}" }
                        div { class: "card-tags",
                            for t in &p.tags { span { class: "chip", "{t}" } }
                        }
                    }
                }
            }
        }
    }
}
