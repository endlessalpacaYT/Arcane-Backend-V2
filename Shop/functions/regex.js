function matchRegex(input) {
    const regex = /(?:CID_)(\d+|A_\d+)(?:_.+)/;
    const match = regex.exec(input);
    if (match) {
      return { id: match[1] };
    }
    return null;
  }
  