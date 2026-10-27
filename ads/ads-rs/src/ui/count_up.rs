//! Count-up — a figure, server-rendered with its final value.

use dioxus::prelude::*;

/// A figure that counts up on scroll. The scroll animation is a client
/// enhancement; this renders the final value so the number is right without
/// JavaScript.
#[component]
pub fn CountUp(
    #[props(default = 0u32)] to: u32,
) -> Element {
    rsx! { span { class: "num", "{to}" } }
}
