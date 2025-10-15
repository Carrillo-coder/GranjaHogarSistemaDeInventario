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

  // alertas
  alert: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca',
    padding: 12, borderRadius: 8, marginBottom: 16,
  },
  listIcon: { marginRight: 8 },
  alertText: { flex: 1, fontSize: 14, color: '#7f1d1d' },
  alertLink: { textDecorationLine: 'underline', fontWeight: '600' },

  // botones
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  half: { flex: 1 },
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8,
    elevation: 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
  },
  buttonIcon: { marginRight: 8 },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#04538A', marginBottom: 12 },

  // footer
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