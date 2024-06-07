export default class Verb {
  constructor(plainForm, type) {
    this.plainForm = plainForm;
    this.type = type;
  }

  getBaseVerb() {
    if (this.type === 'irregular' && (this.plainForm.endsWith('する') || this.plainForm.endsWith('くる'))) {
      return this.plainForm.slice(0, -2);
    }
    return this.plainForm.slice(0, -1);
  }

  getLastChar() {
    return this.plainForm.charAt(this.plainForm.length - 1);
  }

  getMasuForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'ます';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const masuEnding = {
        'う': 'い',
        'つ': 'ち',
        'る': 'り',
        'む': 'み',
        'ぶ': 'び',
        'ぬ': 'に',
        'く': 'き',
        'ぐ': 'ぎ',
        'す': 'し'
      };
      return this.getBaseVerb() + masuEnding[lastChar] + 'ます';
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'します';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'きます';
      }
    }
    return '';
  }

  getTeForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'て';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const teEnding = {
        'う': 'って',
        'つ': 'って',
        'る': 'って',
        'む': 'んで',
        'ぶ': 'んで',
        'ぬ': 'んで',
        'く': 'いて',
        'ぐ': 'いで',
        'す': 'して'
      };
      return this.getBaseVerb() + teEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'して';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'きて';
      }
    }
    return '';
  }

  getTaForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'た';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const taEnding = {
        'う': 'った',
        'つ': 'った',
        'る': 'った',
        'む': 'んだ',
        'ぶ': 'んだ',
        'ぬ': 'んだ',
        'く': 'いた',
        'ぐ': 'いだ',
        'す': 'した'
      };
      return this.getBaseVerb() + taEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'した';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'きた';
      }
    }
    return '';
  }

  getNaiForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'ない';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const naiEnding = {
        'う': 'わない',
        'つ': 'たない',
        'る': 'らない',
        'む': 'まない',
        'ぶ': 'ばない',
        'ぬ': 'なない',
        'く': 'かない',
        'ぐ': 'がない',
        'す': 'さない'
      };
      return this.getBaseVerb() + naiEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'しない';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'こない';
      }
    }
    return '';
  }

  getImperativeForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'ろ';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const imperativeEnding = {
        'う': 'え',
        'つ': 'て',
        'る': 'れ',
        'む': 'め',
        'ぶ': 'べ',
        'ぬ': 'ね',
        'く': 'け',
        'ぐ': 'げ',
        'す': 'せ'
      };
      return this.getBaseVerb() + imperativeEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'しろ';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'こい';
      }
    }
    return '';
  }

  getVolitionalForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'よう';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const volitionalEnding = {
        'う': 'おう',
        'つ': 'とう',
        'る': 'ろう',
        'む': 'もう',
        'ぶ': 'ぼう',
        'ぬ': 'のう',
        'く': 'こう',
        'ぐ': 'ごう',
        'す': 'そう'
      };
      return this.getBaseVerb() + volitionalEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'しよう';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'こよう';
      }
    }
    return '';
  }

  getPotentialForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'られる';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const potentialEnding = {
        'う': 'える',
        'つ': 'てる',
        'る': 'れる',
        'む': 'める',
        'ぶ': 'べる',
        'ぬ': 'ねる',
        'く': 'ける',
        'ぐ': 'げる',
        'す': 'せる'
      };
      return this.getBaseVerb() + potentialEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'できる';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'こられる';
      }
    }
    return '';
  }

  getConditionalForm() {
    if (this.type === 'ichidan') {
      return this.getBaseVerb() + 'れば';
    } else if (this.type === 'godan') {
      const lastChar = this.getLastChar();
      const conditionalEnding = {
        'う': 'えば',
        'つ': 'てば',
        'る': 'れば',
        'む': 'めば',
        'ぶ': 'べば',
        'ぬ': 'ねば',
        'く': 'けば',
        'ぐ': 'げば',
        'す': 'せば'
      };
      return this.getBaseVerb() + conditionalEnding[lastChar];
    } else if (this.type === 'irregular') {
      if (this.plainForm.endsWith('する')) {
        return this.getBaseVerb() + 'すれば';
      } else if (this.plainForm.endsWith('くる')) {
        return this.getBaseVerb() + 'くれば';
      }
    }
    return '';
  }
}
