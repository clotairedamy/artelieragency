//! Dash empty — explains why a panel is empty, with the fix.

use dioxus::prelude::*;

/// A rich empty state: a tone, a plain-words reason, and the fix when there is
/// one.
#[component]
pub fn DashEmpty(
    #[props(into)] title: String,
    #[props(into, optional)] reason: Option<String>,
    #[props(into, optional)] status: Option<String>,
    #[props(into, optional)] fix: Option<String>,
) -> Element {
    let status = status.unwrap_or_else(|| "empty".to_string());
    let tone = if status == "forbidden" || status == "error" {
        "warn"
    } else if status == "unconfigured" {
        "info"
    } else {
        "quiet"
    };
    let glyph = match status.as_str() {
        "forbidden" | "error" => "!",
        "unconfigured" => "?",
        _ => "—",
    };
    let fix = fix.or_else(|| match status.as_str() {
        "forbidden" => Some("Fix the access grant and this panel fills in on its own.".to_string()),
        "unconfigured" => Some("Add the missing environment variable and redeploy.".to_string()),
        _ => None,
    });

    rsx! {
        div { class: "de de--{tone}",
            span { class: "de-mark", "aria-hidden": "true", "{glyph}" }
            div {
                p { class: "de-title", "{title}" }
                if let Some(r) = &reason { p { class: "de-reason", "{r}" } }
                if let Some(f) = &fix { p { class: "de-fix", "{f}" } }
            }
        }
    }
}
