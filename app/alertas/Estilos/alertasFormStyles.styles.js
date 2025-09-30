import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // layout
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#04538A', paddingVertical: 15, paddingHorizontal: 20,
    elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  content: { flex: 1, padding: 16 },

  // cards
  card: {
    backgroundColor: 'white', borderRadius: 8, elevation: 2,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
    borderWidth: 1, borderColor: '#e5e5e5', marginBottom: 16,
  },
  cardHeader: {
    backgroundColor: '#04538A', flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12, borderTopLeftRadius: 8, borderTopRightRadius: 8,
  },
  cardHeaderText: { color: 'white', fontWeight: '700' },

  // table
  table: {
    borderTopWidth: 1, borderTopColor: '#e5e7eb',
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  tr: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  trHeader: {
    backgroundColor: '#f1f5f9',
    borderBottomColor: '#e2e8f0',
  },
  trAlt: { backgroundColor: '#fafafa' },
  trEmpty: { backgroundColor: '#fff' },

  th: { fontWeight: '700', color: '#111827' },
  td: { color: '#111827' },
  muted: { color: '#6b7280' },

  cellProducto: { flex: 2, paddingRight: 8 },
  cellMeta: { flex: 1, paddingLeft: 8 },

  alignRight: { textAlign: 'right' },
  alignLeft: { textAlign: 'left' },

  // bottom nav
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white',
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0',
    elevation: 8, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  navButton: { alignItems: 'center', padding: 8 },

  // logo
  logoContainer: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  logoPlaceholder: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
    elevation: 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
  },
});
