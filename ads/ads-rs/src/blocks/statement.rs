//! Statement section — a few deliberate lines, then a ruled ledger of facts.

use dioxus::prelude::*;

use crate::ui::RevealHeading;

/// A statement with a ledger of facts.
#[component]
pub fn StatementSection(
    #[props(into)] lines: Vec<String>,
    #[props(into, optional)] facts: Option<Vec<(String, String)>>,
) -> Element {
    rsx! {
        section { class: "statement",
            RevealHeading { lines, size: "statement".to_string() }
            if let Some(facts) = &facts {
                if !facts.is_empty() {
                    dl { class: "ads-dl statement-facts",
                        for (term, value) in facts { dt { "{term}" } dd { "{value}" } }
                    }
                }
            }
        }
    }
}
