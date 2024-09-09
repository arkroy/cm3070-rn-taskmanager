import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7D4',
    padding: 20,
    height: '100%',
  },
  input: {
    marginBottom: 10,
    width: '90%',
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: '#DBD9D2',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  primaryButtonContainer: {
    backgroundColor: '#000731',
    borderRadius: 30,
    width: '80%',
    marginTop: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    padding: 15,
    fontSize: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonContainer: {
    backgroundColor: '#85A6BE',
    borderRadius: 30,
    display: 'inline-block',
    width: '80%',
    marginBottom: 5,

  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  removeIcon: {
    marginLeft: 10,
  },
  segmentedControl: {
    marginBottom: 20,
    width: '80%',
  },
  link: {
    color: '#555555',
  },
});

export default styles;