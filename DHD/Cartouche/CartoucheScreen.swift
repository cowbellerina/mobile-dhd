import SwiftUI

/// The Cartouche tab: saved addresses, searchable by name, number or glyph. Swipe right or long-press to dial, swipe
/// left or long-press to delete.
@MainActor
struct CartoucheScreen: View {
    @State private var model = CartoucheViewModel(storage: .live)
    @State private var deletions = 0
    @State private var query = ""
    let onRedial: (CartoucheEntry) -> Void

    var body: some View {
        NavigationStack {
            List {
                ForEach(results) { entry in
                    CartoucheRow(entry: entry)
                        .listRowBackground(Rectangle().fill(.ultraThinMaterial))
                        .swipeActions(edge: .leading, allowsFullSwipe: false) {
                            Button { onRedial(entry) } label: {
                                Label("Dial", systemImage: "phone.fill")
                            }
                            .tint(Theme.Colors.chevronAmber)
                        }
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button(role: .destructive) { delete(entry) } label: {
                                Label("Delete", systemImage: "trash")
                            }
                            .tint(.red)
                        }
                        .contextMenu {
                            Button { onRedial(entry) } label: {
                                Label("Dial", systemImage: "phone.fill")
                            }
                            Button(role: .destructive) { delete(entry) } label: {
                                Label("Delete", systemImage: "trash")
                            }
                        } preview: {
                            CartoucheRow(entry: entry)
                                .padding()
                                .frame(width: 340)
                                .background(Color(uiColor: .secondarySystemBackground))
                        }
                }
            }
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
            .background { StageBackground().ignoresSafeArea() }
            .overlay { emptyState }
            .navigationTitle("Cartouche")
            .searchable(text: $query, prompt: "Name, number or glyph")
        }
        .sensoryFeedback(.success, trigger: deletions)
        .onAppear(perform: model.load)
    }

    @ViewBuilder
    private var emptyState: some View {
        if model.entries.isEmpty {
            ContentUnavailableView {
                Label("No Saved Addresses", systemImage: "bookmark")
            } description: {
                Text("Dial an unknown address on the DHD and save it to a contact to keep it here.")
            }
        } else if results.isEmpty {
            ContentUnavailableView.search(text: query)
        }
    }

    private var results: Cartouche {
        model.entries(matching: query)
    }

    private func delete(_ entry: CartoucheEntry) {
        withAnimation { model.delete(entry) }
        deletions += 1
    }
}

/// One saved address: who it belongs to, then its seven glyphs as lit chevrons.
private struct CartoucheRow: View {
    let entry: CartoucheEntry

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.name)
                    .font(.headline)
                    .foregroundStyle(.primary)
                Text(entry.phoneNumber)
                    .font(.subheadline.monospacedDigit())
                    .foregroundStyle(.secondary)
            }
            ChevronDisplayView(sequence: entry.dialingSequence, tileSize: 38, verticalPadding: 0)
        }
        .padding(.vertical, Theme.Spacing.xs)
        .frame(maxWidth: .infinity, alignment: .leading)
        .contentShape(Rectangle())
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(entry.name), \(entry.phoneNumber)")
        .accessibilityValue(entry.dialingSequence.compactMap { Glyph.named($0)?.name }.joined(separator: ", "))
        .accessibilityIdentifier("cartouche-item-\(entry.id)")
    }
}

#Preview {
    CartoucheScreen(onRedial: { _ in })
}
