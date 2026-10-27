//! The chart chooser — the decision before the component.

use dioxus::prelude::*;

const ROWS: &[(&str, &str, &str)] = &[
    ("Change over time", "Line, or a sparkline beside the figure", "Label the first and last value, never every point"),
    ("Comparing categories", "Horizontal bars, ordered by value", "Never a pie — angle is the hardest encoding to compare"),
    ("One headline number", "Stat tile with a delta", "A figure with no comparison is trivia"),
    ("Part of a whole", "Stacked bar, or just the percentage", "Two or three parts at most"),
    ("Distribution", "Histogram or box plot", "An average hides the shape; show the spread"),
    ("Density over two axes", "Heatmap", "Opacity for magnitude — the channel the eye reads fastest"),
    ("Progress to a target", "Meter with a threshold mark", "The mark is the component"),
    ("Relationship", "Scatter", "Three series maximum"),
];

/// The decision before the component: pick the chart form from the job, not
/// from a gallery.
#[component]
pub fn ChartChoice() -> Element {
    rsx! {
        div { class: "choice",
            table {
                thead {
                    tr { th { "The data's job" } th { "Form" } th { "What decides it" } }
                }
                tbody {
                    for (job, form, decides) in ROWS {
                        tr {
                            td { class: "job", "{job}" }
                            td { class: "form", "{form}" }
                            td { class: "dim", "{decides}" }
                        }
                    }
                }
            }
        }
    }
}
