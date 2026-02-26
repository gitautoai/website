import { parseName } from "./parse-name";

describe("parseName", () => {
  describe("real display names from production", () => {
    it.each([
      // Simple first + last
      ["Ringo De Smet", "Ringo"],
      ["Narek Gevorgyan", "Narek"],
      ["Eduardo Gonzalez", "Eduardo"],
      ["Noah Zoschke", "Noah"],
      ["Jameson Nash", "Jameson"],
      ["Dan Haber", "Dan"],
      ["Hai Rao", "Hai"],
      ["Alex Chaplinsky", "Alex"],
      ["Alexander Shapiotko", "Alexander"],
      ["Tadeu Maia", "Tadeu"],
      ["Lacy Morrow", "Lacy"],
      ["Andrew Coven", "Andrew"],
      ["Nirdesh Dwa", "Nirdesh"],
      ["Almaz Murzabekov", "Almaz"],
      ["Misha Druzhinin", "Misha"],
      ["Chad Pritchett", "Chad"],
      ["Ariel Kanterewicz", "Ariel"],
      ["Ronak Bansal", "Ronak"],
      ["Atouch Mohamed", "Atouch"],
      ["Masahiro Nakahashi", "Masahiro"],
      ["Ankit Tolia", "Ankit"],
      ["Eling Pramuatmaja", "Eling"],
      ["Josh VanAllen", "Josh"],
      ["Shlomy Sheps", "Shlomy"],
      ["Marco Fernandez", "Marco"],
      ["Tatsuya Nakamura", "Tatsuya"],
      ["Vladimir de Turckheim", "Vladimir"],
      ["Peter Somerville", "Peter"],
      ["Camila Macedo", "Camila"],
      ["Shinya Takada", "Shinya"],
      ["Alexander Shcherbakov", "Alexander"],
      ["Greg Harris", "Greg"],
      ["Alexey Kuznetsov", "Alexey"],
      ["Siddhant Badola", "Siddhant"],
      ["Matt Healy", "Matt"],
      ["Mayuresh Jakhotia", "Mayuresh"],
      ["Sushnata Sarkar", "Sushnata"],
      ["Pierre Collinet", "Pierre"],
      ["Aleksandr Smyshliaev", "Aleksandr"],
      ["Ryutaro Sugiyama", "Ryutaro"],
      ["Aran Leite", "Aran"],
      ["Brandon Hosley", "Brandon"],
      ["Mohammad Hossine Rezazadeh", "Mohammad"],
      ["Zhipeng Luo", "Zhipeng"],
      ["Adit Chawdhary", "Adit"],
      ["Thomas Bouffard", "Thomas"],
      ["Hiroki Tashima", "Hiroki"],
      ["Satyam Singh Niranjan", "Satyam"],
      ["Eder Ramos", "Eder"],
      ["Oersted Brion", "Oersted"],
      ["Xavier Defrang", "Xavier"],
      ["Nemoto Masaya", "Nemoto"],
      ["Matas Mat", "Matas"],
      ["Arturo Navarro", "Arturo"],
      ["Marek Küthe", "Marek"],
      ["Klaudijus Mackonis", "Klaudijus"],
      ["Pedro Henrique Diniz", "Pedro"],
      ["Ryo Kobashiri", "Ryo"],
      ["Sagi Faumi", "Sagi"],
      ["Keita Katahira", "Keita"],
      ["Albert Pangilinan", "Albert"],
      ["Batuhan Celasun", "Batuhan"],
      ["Sunil Kumar HS", "Sunil"],
      ["Ohira Shunpei", "Ohira"],
      ["Chaker Ben Said", "Chaker"],
      ["David Brochero", "David"],
      ["Suraj Bhattarai", "Suraj"],
      ["Nikita Malinovsky", "Nikita"],
      ["Isaac Kearse", "Isaac"],
      ["Webster Alk", "Webster"],
      ["Rohit Mane", "Rohit"],
      ["Mitsuhiko Yamamoto", "Mitsuhiko"],
      ["Michael Yao", "Michael"],
      ["Tai Dang", "Tai"],
      ["Eita Nawaji", "Eita"],
      ["Hoàng Phi Hùng", "Hoàng"],
      ["Ammar Ahmed Butt", "Ammar"],
      ["Omkar Hankare", "Omkar"],
      ["Satyam Raj", "Satyam"],
      ["Marco Kazama", "Marco"],
      ["Davi Souza", "Davi"],
      ["Naman Joshi", "Naman"],
      ["Soo Kim", "Soo"],
      ["Erick Bueno", "Erick"],
      ["Ryan Mudryk", "Ryan"],
      ["Takumi Sasada", "Takumi"],
      ["Yang Qu", "Yang"],
      ["Honda Jun", "Honda"],
      ["Robin Junior Rodriguez Henao", "Robin"],
      ["Joshua Chennault", "Joshua"],
      ["Yuma Nunoya", "Yuma"],
      ["Jeko Paul", "Jeko"],
      ["Hamza Rebb", "Hamza"],
      ["Ryan Townsend", "Ryan"],
      ["Jakhangir Esanov", "Jakhangir"],
      ["Shuhei Hikosaka", "Shuhei"],
      ["Mike Harrison", "Mike"],
      ["Yuya Takemasa", "Yuya"],
      ["Takahiro Nakagawa", "Takahiro"],
      ["Matan Coiffman", "Matan"],
      ["Taichi Masakazu", "Taichi"],
      ["Masakiyo Nishikawa", "Masakiyo"],
      ["Akshay Nair A", "Akshay"],
      ["Girma  Wakeyo", "Girma"],
      ["Yoshiharu Hirose", "Yoshiharu"],
      ["Ashley Casey", "Ashley"],
      ["Kawata Hiroki", "Kawata"],
      ["Hideaki Shiina", "Hideaki"],
      ["Oladoye Heritage", "Oladoye"],
      ["Anadi Mishra", "Anadi"],
      ["Andrew Li", "Andrew"],
      ["Diksha Wagh", "Diksha"],
      ["Calvin Fernandes", "Calvin"],
      ["Pamela Ardana", "Pamela"],
      ["Manuel Carter", "Manuel"],
      ["Débora Lutz", "Débora"],
      ["Artem Filin", "Artem"],
      ["Richard Kindler", "Richard"],
      ["Mirza Asadullah", "Mirza"],
      ["David Burns", "David"],
      ["Alex Scott", "Alex"],
      ["Muhammad Anas", "Muhammad"],
      ["Mohammad Al Amin Sheikh", "Mohammad"],
      ["David Chen", "David"],
      ["Fre Dy", "Fre"],
      ["Alexis Placencia - the schizo", "Alexis"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("single display names", () => {
    it.each([
      ["Memory", "Memory"],
      ["Glow", "Glow"],
      ["Yumenosuke", "Yumenosuke"],
      ["Holden", "Holden"],
      ["Roman", "Roman"],
      ["Yaovi", "Yaovi"],
      ["Nils", "Nils"],
      ["David", "David"],
      ["Lg", "Lg"],
      ["Sam", "Sam"],
      ["Samzong", "Samzong"],
      ["Daemon", "Daemon"],
      ["Yuns", "Yuns"],
      ["Flasic", "Flasic"],
      ["Miguel", "Miguel"],
      ["Specs", "Specs"],
      ["Azit", "Azit"],
      ["Vandy", "Vandy"],
      ["Armand", "Armand"],
      ["Young", "Young"],
      ["Abhi", "Abhi"],
      ["Brandon", "Brandon"],
      ["Kazumi", "Kazumi"],
      ["Kit", "Kit"],
      ["Mathis", "Mathis"],
      ["Corazon", "Corazon"],
      ["Death", "Death"],
      ["Eric", "Eric"],
      ["Yuta", "Yuta"],
      ["Jenny", "Jenny"],
      ["Cody", "Cody"],
      ["Victor", "Victor"],
      ["Mat", "Mat"],
      ["Oriya", "Oriya"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("CJK and unicode names", () => {
    it.each([
      ["嘤嘤", "嘤嘤"],
      ["何鑫", "何鑫"],
      ["纯粹", "纯粹"],
      ["高森松太郎", "高森松太郎"],
      ["André Goulart Nogueira", "André"],
      ["José María García", "José"],
      ["Müller Schmidt", "Müller"],
      ["Nendō", "Nendō"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("parentheses stripping", () => {
    it.each([
      ["Hiroshi (Wes) Nishio", "Hiroshi"],
      ["(Mr.) Noah Zoschke", "Noah"],
      ["Dan Haber (Jr.)", "Dan"],
      ["(Nickname)", "there"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("title/initial prefix skipping", () => {
    it.each([
      ["Dr. John Doe", "John"],
      ["L. Dayrit", "Dayrit"],
      ["Milind A. Joshi", "Milind"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("dot-separated handles", () => {
    it.each([
      ["Frater.nul", "Frater"],
      ["M.Rama Karthik", "Rama"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("usernames without display name — title-cased", () => {
    it.each([
      ["fourcolors", "Fourcolors"],
      ["sree", "Sree"],
      ["Carsaig", "Carsaig"],
      ["Efreak", "Efreak"],
      ["Hexaf", "Hexaf"],
      ["scherenhaenden", "Scherenhaenden"],
      ["atriede", "Atriede"],
      ["keeeener", "Keeeener"],
      ["Jellebels", "Jellebels"],
      ["lordmage", "Lordmage"],
      ["seigot", "Seigot"],
      ["koheitech", "Koheitech"],
      ["mozzaru", "Mozzaru"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("hyphenated usernames — take first segment", () => {
    it.each([
      ["cuong-tran", "Cuong"],
      ["toshimasa-sekine", "Toshimasa"],
      ["kana-shii", "Kana"],
      ["hazem-hosny", "Hazem"],
      ["matthew-heartful", "Matthew"],
      ["ken-shiozawa", "Ken"],
      ["airi-nakamura", "Airi"],
      ["kawaguchi-ryosuke", "Kawaguchi"],
      ["Three-summers", "Three"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("multi-token hyphenated names — keep hyphen", () => {
    it.each([
      ["Kaelig Deloumeau-Prigent", "Kaelig"],
      ["Mary-Jane Watson", "Mary-Jane"],
      ["Jean-Pierre Dupont", "Jean-Pierre"],
      ["O'Connor Smith", "O'Connor"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("usernames with digits — return 'there'", () => {
    it.each([
      ["afc163", "there"],
      ["apis3445", "there"],
      ["parthi2929", "there"],
      ["w7989363", "there"],
      ["tbowman01", "there"],
      ["Dark25", "there"],
      ["broli95", "there"],
      ["St119848", "there"],
      ["RyoFuji619", "there"],
      ["Khan285", "there"],
      ["Guts98", "there"],
      ["Itz4Blitz", "there"],
      ["Gugan22", "there"],
      ["Coldtrigon66", "there"],
      ["ONE223", "there"],
      ["niraj876", "there"],
      ["Mr2Cool", "there"],
      ["Elegy233", "there"],
      ["93Pd9s8Jt", "there"],
      ["AhJi26", "there"],
      ["NoFace33", "there"],
      ["curry798", "there"],
      ["Sket1374@Gmail.Com", "there"],
      ["Coolguy1211", "there"],
      ["Toyro967", "there"],
      ["devils6669", "there"],
      ["R4fa3l2008", "there"],
      ["Mehandsome9", "there"],
      ["psluca911", "there"],
      ["Esequiel122", "there"],
      ["Da3m0N0", "there"],
      ["MilosKerkez123", "there"],
      ["2025ss", "there"],
      ["Lamed12", "there"],
      ["alzaem3000", "there"],
    ])("%s → %s", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("edge cases", () => {
    it.each([
      ["", "there"],
      ["   ", "there"],
      ["()", "there"],
      ["  (test)  ", "there"],
    ])("'%s' → '%s'", (input, expected) => {
      expect(parseName(input).firstName).toBe(expected);
    });
  });

  describe("lastName", () => {
    it.each([
      ["Ringo De Smet", "Smet"],
      ["Kaelig Deloumeau-Prigent", "Deloumeau-Prigent"],
      ["Hiroshi (Wes) Nishio", "Nishio"],
      ["Glow", "Glow"],
      ["", ""],
    ])("%s → lastName: %s", (input, expected) => {
      expect(parseName(input).lastName).toBe(expected);
    });
  });
});
