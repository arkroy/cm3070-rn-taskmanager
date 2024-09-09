import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButtonContainer: {
    backgroundColor: '#000731',
    borderRadius: 30,
    display: 'inline-block',
    width: '50%',
    marginRight: 5,
  },
  secondaryButtonContainer: {
    backgroundColor: '#85A6BE',
    borderRadius: 30,
    display: 'inline-block',
    width: '50%',
    marginLeft: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    padding: 15,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF7D4',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#DBD9D2',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  link: {
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default styles;
