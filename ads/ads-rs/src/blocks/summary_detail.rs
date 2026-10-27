//! Summary → detail — the pattern the whole system is arranged around.

use dioxus::prelude::*;

/// One rung of the ladder (answer → reasoning → evidence).
#[derive(Clone, PartialEq)]
pub struct Rung {
    pub title: String,
    pub body: String,
}

impl Rung {
    #[must_use]
    pub fn new(title: impl Into<String>, body: impl Into<String>) -> Self {
        Self { title: title.into(), body: body.into() }
    }
}

/// A ranked answer at the top, the reasoning one level down, the raw rows two
/// levels down.
#[component]
pub fn SummaryDetail(
    #[props(into, optional)] rungs: Option<Vec<Rung>>,
) -> Element {
    let rungs = rungs.unwrap_or_else(|| {
        vec![
            Rung::new("Answer.", "One ranked list."),
            Rung::new("Reasoning.", "Why this ranks first."),
            Rung::new("Evidence.", "The grid, filtered, with the filter visible as a tag."),
        ]
    });
    rsx! {
        ol { class: "ladder",
            for (i, r) in rungs.iter().enumerate() {
                li { class: "rung",
                    span { class: "num n", "{i + 1}" }
                    p { class: "body",
                        strong { "{r.title} " }
                        "{r.body}"
                    }
                }
            }
        }
    }
}
