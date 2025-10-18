// HomeScreen styles (Vulnerable Version)
import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 50 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  secret: { 
    color: 'red', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  controlPanel: { 
    marginBottom: 15, 
    padding: 10, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 8 
  },
  input: { 
    borderWidth: 1, 
    padding: 5, 
    backgroundColor: 'white', 
    marginTop: 5, 
    marginBottom: 5 
  },
  hint: { 
    fontSize: 10, 
    color: 'gray' 
  },
  card: { 
    padding: 15, 
    backgroundColor: 'white', 
    marginBottom: 10, 
    borderRadius: 8, 
    elevation: 2 
  },
  cardTitle: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  meta: { 
    fontSize: 10, 
    color: 'gray', 
    marginTop: 5 
  },
  list: { 
    flex: 1 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingTop: 10 
  }
});
