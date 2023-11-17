class Utils {
  static formatList(list) {
    // Formate les éléments de la liste
    const formattedList = list.map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());
    
    // Filtre les doublons
    const uniqueList = formattedList.filter(
      (item, index) => formattedList.indexOf(item) === index
    );

    // Trie la liste
    const sortedList = uniqueList.sort((a, b) => a.localeCompare(b));

    return sortedList;
  }
}