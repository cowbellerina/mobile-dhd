import OSLog

/// Unified logging. View in Xcode's console, or Console.app filtered by subsystem.
enum Log {
    private static let subsystem = Bundle.main.bundleIdentifier ?? "DHD"

    static var storage: Logger { Logger(subsystem: subsystem, category: "storage") }
    static var dialing: Logger { Logger(subsystem: subsystem, category: "dialing") }
    static var audio: Logger { Logger(subsystem: subsystem, category: "audio") }
    static var contacts: Logger { Logger(subsystem: subsystem, category: "contacts") }
}
