# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-12

### Added
- **Data Hierarchy**: All area levels (regency, district, village) now include full parent hierarchy names (e.g., `provinceName`, `regencyName`).
- **Data Validation Scripts**: Added `validate-data.js` to ensure internal data integrity (no orphans, no duplicates).
- **Automated Hierarchy Fixes**: The build script now automatically creates placeholder parents for any orphaned data, ensuring full data integrity.

### Changed
- **Data Standardization**: All area names are now standardized to **Title Case** for better display consistency.
- **Refactored Build Process**: The `build-json.js` script now uses a more robust two-pass process to ensure all hierarchies are correctly resolved.
- **Improved Scraper**: The postal code scraper (`scrape-by-district.js`) is now significantly more efficient, scraping by district instead of by village.

### Fixed
- **Hierarchy Mismatches**: Fixed numerous issues where `regencyName` was empty or incorrect due to data source inconsistencies.
- **Test Suite**: Updated all tests to align with the new standardized data formats (Title Case names).

## [1.1.1] - 2026-03-11

- Initial release with basic data structure and plugin architecture.
