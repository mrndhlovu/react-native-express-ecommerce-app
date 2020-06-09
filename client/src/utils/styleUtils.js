import {StyleSheet} from 'react-native';

const primaryColor = '#FF6363';
const full = '100%';

const borderStyle = {
  borderColor: '#ECECEC',
  borderStyle: 'solid',
  borderWidth: 1,
};

export const STYLES = StyleSheet.create({
  home: {
    backgroundColor: '#fff',
    height: '100%',
  },
  menuIcon: {
    position: 'absolute',
    zIndex: 5,
    left: 15,
    top: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroContainer: {
    flexDirection: 'column',
    height: '25%',
  },
  heroImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  colorSleeve: {
    position: 'absolute',
    top: '25%',
    left: 0,
    backgroundColor: '#C2EEE6',
    height: 118,
    width: full,
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    ...borderStyle,
    position: 'absolute',
    top: '22%',
    backgroundColor: '#fff',
  },

  searchInput: {
    height: 38,
    padding: 10,
    width: '90%',
  },
  searchIconWrapper: {
    backgroundColor: primaryColor,
    height: full,
    display: 'flex',
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    color: '#fff',
    fontSize: 18,
  },

  recentOrders: {
    position: 'absolute',
    top: '30%',
    height: 121,
    backgroundColor: '#fff',
    marginLeft: 15,
    marginRight: 15,
    ...borderStyle,
  },
  noOrders: {
    margin: 42,
  },

  noOrdersText: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },
});
