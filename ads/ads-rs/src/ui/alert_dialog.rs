//! Confirmation dialog — a modal with a cancel/action pair.

use dioxus::prelude::*;

use super::button::{AdsButton, ButtonVariant};
use super::feedback::AdsModal;

/// A confirmation dialog. The accent goes on the action, never on a
/// destructive cancel.
#[component]
pub fn AdsAlertDialog(
    #[props(into, optional)] title: Option<String>,
    #[props(into, optional)] description: Option<String>,
    #[props(into, default = "Cancel".to_string())] cancel_label: String,
    #[props(into, default = "Continue".to_string())] action_label: String,
    #[props(optional)] open: bool,
    #[props(optional)] onaction: Option<EventHandler<MouseEvent>>,
    #[props(optional)] oncancel: Option<EventHandler<MouseEvent>>,
) -> Element {
    rsx! {
        AdsModal { open, title,
            if let Some(d) = &description { p { class: "ink-subdued", "{d}" } }
            div { class: "row", style: "gap:12px",
                AdsButton { variant: ButtonVariant::Quiet, onclick: oncancel, "{cancel_label}" }
                AdsButton { variant: ButtonVariant::Accent, onclick: onaction, "{action_label}" }
            }
        }
    }
}
