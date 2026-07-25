import type { CodeSolution } from "./schema";

// ---------- Company registry ----------
export type MncCompany = {
  slug: string;
  name: string;
  mark: string; // single glyph used as logo mark
  tagline: string;
  accent: string; // hex color for stripe / chip
  ink: string; // darker hex for text on tinted chip
  tint: string; // very light bg hex
  tracks: Record<"aptitude" | "reasoning" | "general" | "programming", string[]>;
};

export const MNC_COMPANIES: MncCompany[] = [
  {
    slug: "google", name: "Google", mark: "G", tagline: "Search · Cloud · AI · Android",
    accent: "#1A73E8", ink: "#0B3FA0", tint: "#E8F0FE",
    tracks: {
      aptitude: ["Quantitative Aptitude", "Probability & Stats", "Puzzles", "Number Theory"],
      reasoning: ["Logical Puzzles", "Pattern Recognition", "Analytical Reasoning"],
      general: ["Verbal Ability", "Reading Comprehension", "Tech GK"],
      programming: ["Algorithm Analysis", "Data Structures", "System Design Basics", "C++ Output"],
    },
  },
  {
    slug: "microsoft", name: "Microsoft", mark: "⊞", tagline: "Cloud · OS · Productivity · AI",
    accent: "#00A4EF", ink: "#005A87", tint: "#E3F4FC",
    tracks: {
      aptitude: ["Quantitative Aptitude", "Time & Work", "Profit & Loss"],
      reasoning: ["Logical Reasoning", "Critical Thinking", "Puzzles"],
      general: ["Verbal Ability", "Sentence Correction", "Cloud GK"],
      programming: ["C# / .NET Concepts", "OOP Principles", "SQL Queries", "Python Output"],
    },
  },
  {
    slug: "tcs", name: "TCS", mark: "T", tagline: "NQT · Digital · Ninja tracks",
    accent: "#1E3A8A", ink: "#0E1F52", tint: "#E6ECFA",
    tracks: {
      aptitude: ["NQT Quant", "Percentages", "Speed & Distance", "Mixtures"],
      reasoning: ["NQT Logical", "Data Sufficiency", "Visual Reasoning"],
      general: ["NQT Verbal", "Error Spotting", "Fill in the Blanks"],
      programming: ["C Output", "Pseudo-code Trace", "DBMS Basics", "OOP Concepts"],
    },
  },
  {
    slug: "lnt", name: "L&T", mark: "L", tagline: "Engineering · Construction · Tech",
    accent: "#0B3D91", ink: "#061F4A", tint: "#E4E9F4",
    tracks: {
      aptitude: ["Quantitative Aptitude", "Engineering Maths", "Mensuration"],
      reasoning: ["Analytical Reasoning", "Seating Arrangements", "Series"],
      general: ["Verbal English", "Technical Awareness", "Group Discussion"],
      programming: ["C / C++ Output", "Core CS", "Embedded Basics", "Data Structures"],
    },
  },
  {
    slug: "infosys", name: "Infosys", mark: "i", tagline: "InfyTQ · System Engineering · Power Programmer",
    accent: "#007CC3", ink: "#004A78", tint: "#E1F1FA",
    tracks: {
      aptitude: ["Infosys Quant", "Data Interpretation", "Percentages"],
      reasoning: ["Puzzle Solving", "Data Sufficiency", "Input-Output"],
      general: ["Verbal Ability", "Reading Comprehension", "Sentence Completion"],
      programming: ["Pseudo-code", "C Output", "Java Concepts", "DBMS"],
    },
  },
  {
    slug: "cognizant", name: "Cognizant", mark: "C", tagline: "GenC · Digital · Gemini track",
    accent: "#006FB1", ink: "#00426B", tint: "#E1EFF8",
    tracks: {
      aptitude: ["GenC Quant", "Profit & Loss", "Time-Speed-Distance"],
      reasoning: ["Logical Reasoning", "Coding-Decoding", "Blood Relations"],
      general: ["Verbal Ability", "Sentence Correction", "Cloze Test"],
      programming: ["C / Java Output", "OOP", "OS & Networks", "SQL"],
    },
  },
  {
    slug: "wipro", name: "Wipro", mark: "W", tagline: "NLTH · Turbo · Elite tracks",
    accent: "#E4002B", ink: "#8A0019", tint: "#FCE6EA",
    tracks: {
      aptitude: ["Wipro Quant", "Number System", "Averages"],
      reasoning: ["Logical Reasoning", "Verbal Reasoning", "Syllogism"],
      general: ["English Language", "Grammar", "Business GK"],
      programming: ["C Output", "Java Concepts", "DBMS", "Automation Basics"],
    },
  },
  {
    slug: "aditya-birla", name: "Aditya Birla Group", mark: "AB", tagline: "ABGSLT · Finance · Manufacturing",
    accent: "#1B365D", ink: "#0A1A33", tint: "#E5EAF2",
    tracks: {
      aptitude: ["ABG Quant", "Data Interpretation", "Partnership"],
      reasoning: ["Logical Reasoning", "Critical Reasoning", "Visual Puzzles"],
      general: ["Verbal English", "Current Affairs", "Business Awareness"],
      programming: ["Core CS", "SQL", "C / C++ Snippets", "Networks"],
    },
  },
  {
    slug: "siemens", name: "Siemens", mark: "S", tagline: "Industrial · Automation · Digital Twin",
    accent: "#009999", ink: "#005656", tint: "#DFF2F2",
    tracks: {
      aptitude: ["Engineering Quant", "Mensuration", "Probability"],
      reasoning: ["Analytical Reasoning", "Mechanical Reasoning", "Series"],
      general: ["Verbal English", "Technical Awareness", "Industrial GK"],
      programming: ["C / Embedded", "PLC Basics", "Data Structures", "OOP"],
    },
  },
  {
    slug: "icici", name: "ICICI Bank", mark: "₹", tagline: "PO · Clerk · Specialist Officer",
    accent: "#F58220", ink: "#8A4708", tint: "#FDEBDA",
    tracks: {
      aptitude: ["Banking Quant", "Simplification", "Data Interpretation"],
      reasoning: ["Banking Reasoning", "Puzzle", "Inequality"],
      general: ["English Language", "Banking Awareness", "Current Affairs"],
      programming: ["Computer Awareness", "DBMS", "Networking", "C Basics"],
    },
  },
  {
    slug: "ibm", name: "IBM", mark: "≡", tagline: "Cloud · AI · Quantum · Consulting",
    accent: "#0F62FE", ink: "#002D9C", tint: "#E2ECFE",
    tracks: {
      aptitude: ["IBM Quant", "Arithmetic", "Data Interpretation"],
      reasoning: ["Logical Reasoning", "Abstract Reasoning", "Verbal Logic"],
      general: ["Verbal English", "Situational Judgment", "Cloud GK"],
      programming: ["Core CS", "Java / Python", "Mainframe Awareness", "DBMS"],
    },
  },
];

// ---------- Shared MCQ templates per track ----------
type Tpl = {
  q: (t: string) => string;
  o: string[];
  c: number;
  e: string;
};

const APT: Tpl[] = [
  { q: (t) => `In ${t}: A shopkeeper marks a product 25% above cost and gives a 10% discount. Net profit %?`,
    o: ["10%", "12.5%", "15%", "20%"], c: 1,
    e: "Let CP=100. MP=125. Discount=12.5. SP=112.5 ⇒ profit=12.5%." },
  { q: (t) => `${t} drill: A train 180 m long crosses a 120 m platform in 15 s. Speed in km/h?`,
    o: ["54", "60", "72", "80"], c: 2,
    e: "Total distance 300 m in 15 s = 20 m/s = 72 km/h." },
  { q: (t) => `${t}: Average of 7 numbers is 18. If one number 24 is removed, new average?`,
    o: ["16", "17", "18", "19"], c: 1,
    e: "Sum=126, new sum=102, average over 6 = 17." },
  { q: (t) => `${t}: Ratio of A:B:C is 2:3:5. If B's share is ₹1500, total?`,
    o: ["₹4000", "₹5000", "₹6000", "₹7500"], c: 1,
    e: "3 units = 1500 ⇒ 1 unit=500 ⇒ 10 units=₹5000." },
  { q: (t) => `${t}: A sum doubles in 8 years at simple interest. Rate?`,
    o: ["8%", "10%", "12.5%", "15%"], c: 2,
    e: "SI = P when amount doubles. R = 100/8 = 12.5%." },
  { q: (t) => `${t}: 30% of a number equals 45. The number is?`,
    o: ["120", "135", "150", "180"], c: 2,
    e: "0.3x = 45 ⇒ x = 150." },
  { q: (t) => `${t}: A completes work in 12 days, B in 18 days. Together they finish in?`,
    o: ["6.2 days", "7.2 days", "8 days", "9 days"], c: 1,
    e: "1/12+1/18=5/36 ⇒ 36/5 = 7.2 days." },
  { q: (t) => `${t}: CP of 12 items = SP of 9 items. Profit %?`,
    o: ["25%", "33.33%", "40%", "50%"], c: 1,
    e: "Profit on 9 = CP of 3 ⇒ 3/9 = 33.33%." },
];

const REA: Tpl[] = [
  { q: (t) => `${t}: If FRIEND is coded as HUMJTK, how is CANDLE coded?`,
    o: ["DCQHQK", "ECPFRL", "EDRIRL", "DEQJQM"], c: 2,
    e: "Each letter shifts +2,+3,+4,+5,+6,+7. C+2=E, A+3=D, N+4=R, D+5=I, L+6=R, E+7=L ⇒ EDRIRL." },
  { q: (t) => `${t}: Pointing to a photo, a man said, "She is the daughter of my grandfather's only son." How is she related to him?`,
    o: ["Sister", "Cousin", "Aunt", "Mother"], c: 0,
    e: "Grandfather's only son = the man's father. His daughter = the man's sister." },
  { q: (t) => `${t}: A walks 10 m north, turns right, walks 5 m, turns right again, walks 10 m. Direction from start?`,
    o: ["North", "South", "East", "West"], c: 2,
    e: "Final position is 5 m east of start." },
  { q: (t) => `${t}: Statements: All pens are ink. Some ink is paper. Conclusion: Some pens are paper.`,
    o: ["Follows", "Does not follow", "Either I or II", "Both"], c: 1,
    e: "The middle term ink is undistributed; no definite conclusion about pens & paper." },
  { q: (t) => `${t}: Book : Author :: Painting : ?`,
    o: ["Canvas", "Brush", "Artist", "Gallery"], c: 2,
    e: "An author creates a book; an artist creates a painting." },
  { q: (t) => `${t}: Find the odd one: 2, 3, 5, 9, 11`,
    o: ["2", "3", "9", "11"], c: 2,
    e: "All others are primes; 9 = 3²." },
];

const GEN: Tpl[] = [
  { q: (t) => `${t}: Choose the synonym of 'Meticulous'.`,
    o: ["Careless", "Thorough", "Rude", "Lazy"], c: 1,
    e: "Meticulous means showing great attention to detail; thorough." },
  { q: (t) => `${t}: Choose the antonym of 'Benevolent'.`,
    o: ["Kind", "Generous", "Malevolent", "Charitable"], c: 2,
    e: "Benevolent = well-meaning; opposite is malevolent." },
  { q: (t) => `${t}: She has been working here _____ 2019.`,
    o: ["since", "for", "from", "at"], c: 0,
    e: "Present perfect continuous + specific year ⇒ 'since'." },
  { q: (t) => `${t}: Identify the error: "Neither of the two boys were present."`,
    o: ["Neither of", "the two boys", "were present", "No error"], c: 2,
    e: "'Neither' takes a singular verb ⇒ 'was present'." },
  { q: (t) => `${t}: The idiom 'burn the midnight oil' means:`,
    o: ["Waste resources", "Work late into the night", "Cook at night", "Save energy"], c: 1,
    e: "It means to work or study late into the night." },
  { q: (t) => `${t}: World Environment Day is observed on:`,
    o: ["5 June", "22 April", "1 December", "16 September"], c: 0,
    e: "UN-designated World Environment Day is 5 June." },
];

const PROG: Tpl[] = [
  { q: (t) => `${t}: What does this C snippet print?\nint a=5; printf("%d", a++ + ++a);`,
    o: ["11", "12", "Undefined behavior", "10"], c: 2,
    e: "Modifying a twice without a sequence point is undefined behavior in C." },
  { q: (t) => `${t}: Python output of: print([1,2,3] + [4,5])`,
    o: ["[1,2,3,4,5]", "[5,7,3]", "Error", "[1,2,3,[4,5]]"], c: 0,
    e: "List concatenation with + joins the two lists." },
  { q: (t) => `${t}: In Java, which keyword prevents a method from being overridden?`,
    o: ["static", "final", "abstract", "volatile"], c: 1,
    e: "final on a method blocks subclass overriding." },
  { q: (t) => `${t}: Which normal form eliminates transitive dependency?`,
    o: ["1NF", "2NF", "3NF", "BCNF"], c: 2,
    e: "3NF removes transitive dependencies among non-key attributes." },
  { q: (t) => `${t}: Time complexity of binary search on a sorted array of size n?`,
    o: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], c: 1,
    e: "Each step halves the search space ⇒ O(log n)." },
  { q: (t) => `${t}: A process in 'ready' state is waiting for:`,
    o: ["I/O completion", "CPU scheduling", "Memory allocation only", "User input"], c: 1,
    e: "Ready processes await the scheduler to assign the CPU." },
];

const BANKS: Record<"aptitude" | "reasoning" | "general" | "programming", Tpl[]> = {
  aptitude: APT,
  reasoning: REA,
  general: GEN,
  programming: PROG,
};

// ---------- Shared coding problem bank ----------
type SeedCoding = {
  number: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  sampleExplanation: string;
  solutions: CodeSolution[];
  commonMistakes: string[];
  similarProblems: string[];
  proTip: string;
};

const py = (code: string, t: string, s: string, e: string): CodeSolution => ({ language: "Python", code, timeComplexity: t, spaceComplexity: s, explanation: e });
const java = (code: string, t: string, s: string, e: string): CodeSolution => ({ language: "Java", code, timeComplexity: t, spaceComplexity: s, explanation: e });
const cpp = (code: string, t: string, s: string, e: string): CodeSolution => ({ language: "C++", code, timeComplexity: t, spaceComplexity: s, explanation: e });
const c = (code: string, t: string, s: string, e: string): CodeSolution => ({ language: "C", code, timeComplexity: t, spaceComplexity: s, explanation: e });

const CODING_BANK: SeedCoding[] = [
  {
    number: 1, title: "Reverse a String", slug: "reverse-string", difficulty: "Easy", topic: "Strings",
    statement: "Given a string S, return its reverse without using built-in reverse.",
    constraints: "1 ≤ |S| ≤ 10⁵", inputFormat: "A single line string S", outputFormat: "Reversed string",
    sampleInput: "HelloWorld", sampleOutput: "dlroWolleH",
    sampleExplanation: "Characters reversed in place.",
    solutions: [
      py("s=input().strip()\nprint(s[::-1])", "O(n)", "O(n)", "Slice with step -1."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);String s=sc.nextLine();System.out.println(new StringBuilder(s).reverse());}}", "O(n)", "O(n)", "StringBuilder.reverse."),
      cpp("#include<bits/stdc++.h>\nusing namespace std;\nint main(){string s;cin>>s;reverse(s.begin(),s.end());cout<<s;}", "O(n)", "O(1)", "std::reverse in place."),
      c("#include<stdio.h>\n#include<string.h>\nint main(){char s[100001];scanf(\"%s\",s);int n=strlen(s);for(int i=n-1;i>=0;i--)putchar(s[i]);}", "O(n)", "O(1)", "Walk from end."),
    ],
    commonMistakes: ["Using disallowed built-in reverse", "Off-by-one on indices"],
    similarProblems: ["Palindrome check", "Reverse words"], proTip: "Two-pointer swap gives O(1) extra space in mutable arrays.",
  },
  {
    number: 2, title: "Two Sum", slug: "two-sum", difficulty: "Easy", topic: "Hashing",
    statement: "Given an array and target T, find two indices whose values sum to T.",
    constraints: "2 ≤ N ≤ 10⁵", inputFormat: "Line 1: N T\nLine 2: N integers", outputFormat: "Two space-separated indices (0-based, smaller first)",
    sampleInput: "4 9\n2 7 11 15", sampleOutput: "0 1",
    sampleExplanation: "2 + 7 = 9 at indices 0 and 1.",
    solutions: [
      py("n,t=map(int,input().split())\na=list(map(int,input().split()))\nd={}\nfor i,v in enumerate(a):\n    if t-v in d: print(d[t-v],i); break\n    d[v]=i", "O(n)", "O(n)", "Hash map of seen values."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);int n=sc.nextInt(),t=sc.nextInt();int[]arr=new int[n];for(int i=0;i<n;i++)arr[i]=sc.nextInt();Map<Integer,Integer>m=new HashMap<>();for(int i=0;i<n;i++){if(m.containsKey(t-arr[i])){System.out.println(m.get(t-arr[i])+\" \"+i);return;}m.put(arr[i],i);}}}", "O(n)", "O(n)", "HashMap lookup."),
      cpp("#include<bits/stdc++.h>\nusing namespace std;\nint main(){int n,t;cin>>n>>t;unordered_map<int,int>m;for(int i=0;i<n;i++){int v;cin>>v;auto it=m.find(t-v);if(it!=m.end()){cout<<it->second<<\" \"<<i;return 0;}m[v]=i;}}", "O(n)", "O(n)", "Unordered map."),
    ],
    commonMistakes: ["Returning same index twice", "Not handling duplicates"], similarProblems: ["3Sum", "Pair with given diff"], proTip: "One-pass hash is usually fastest in practice.",
  },
  {
    number: 3, title: "Max Subarray Sum", slug: "max-subarray-sum", difficulty: "Medium", topic: "DP",
    statement: "Find the contiguous subarray with the largest sum (Kadane's).",
    constraints: "1 ≤ N ≤ 10⁵", inputFormat: "Line 1: N\nLine 2: N integers", outputFormat: "Maximum subarray sum",
    sampleInput: "8\n-2 1 -3 4 -1 2 1 -5 4",
    sampleOutput: "6", sampleExplanation: "[4,-1,2,1] sums to 6.",
    solutions: [
      py("n=int(input())\na=list(map(int,input().split()))\ncur=best=a[0]\nfor v in a[1:]:\n    cur=max(v,cur+v); best=max(best,cur)\nprint(best)", "O(n)", "O(1)", "Kadane's algorithm."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);int n=sc.nextInt();int cur=sc.nextInt(),best=cur;for(int i=1;i<n;i++){int v=sc.nextInt();cur=Math.max(v,cur+v);best=Math.max(best,cur);}System.out.println(best);}}", "O(n)", "O(1)", "Kadane."),
      cpp("#include<bits/stdc++.h>\nusing namespace std;\nint main(){int n;cin>>n;int v;cin>>v;int cur=v,best=v;for(int i=1;i<n;i++){cin>>v;cur=max(v,cur+v);best=max(best,cur);}cout<<best;}", "O(n)", "O(1)", "Kadane."),
    ],
    commonMistakes: ["Initialising cur=0 breaks all-negative arrays", "Forgetting to track best separately"],
    similarProblems: ["Max product subarray", "Circular max subarray"], proTip: "Kadane handles all-negative arrays if initialised with a[0].",
  },
  {
    number: 4, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", topic: "Stack",
    statement: "Check if a string of (), {}, [] is balanced.",
    constraints: "1 ≤ |S| ≤ 10⁵", inputFormat: "String S", outputFormat: "true or false",
    sampleInput: "{[()]}", sampleOutput: "true", sampleExplanation: "Every open matches the right close.",
    solutions: [
      py("s=input().strip()\nst=[]\nm={')':'(','}':'{',']':'['}\nok=True\nfor c in s:\n    if c in '({[': st.append(c)\n    else:\n        if not st or st[-1]!=m[c]: ok=False;break\n        st.pop()\nprint('true' if ok and not st else 'false')", "O(n)", "O(n)", "Stack of openers."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);String s=sc.nextLine();Deque<Character>st=new ArrayDeque<>();Map<Character,Character>m=Map.of(')','(','}','{',']','[');boolean ok=true;for(char c:s.toCharArray()){if(\"({[\".indexOf(c)>=0)st.push(c);else{if(st.isEmpty()||st.pop()!=m.get(c)){ok=false;break;}}}System.out.println(ok&&st.isEmpty());}}", "O(n)", "O(n)", "Deque stack."),
      cpp("#include<bits/stdc++.h>\nusing namespace std;\nint main(){string s;cin>>s;stack<char>st;unordered_map<char,char>m={{')','('},{'}','{'},{']','['}};bool ok=true;for(char c:s){if(c=='('||c=='{'||c=='[')st.push(c);else{if(st.empty()||st.top()!=m[c]){ok=false;break;}st.pop();}}cout<<(ok&&st.empty()?\"true\":\"false\");}", "O(n)", "O(n)", "Stack."),
    ],
    commonMistakes: ["Forgetting empty-stack check on close", "Returning true when stack not empty at end"],
    similarProblems: ["Min remove to make valid", "Longest valid parentheses"], proTip: "Use a map from close→open to avoid nested ifs.",
  },
  {
    number: 5, title: "Level Order Traversal", slug: "level-order", difficulty: "Medium", topic: "Trees",
    statement: "Print a binary tree level by level. Input given as space-separated values in level order with -1 as null.",
    constraints: "1 ≤ N ≤ 10⁴", inputFormat: "Line 1: N\nLine 2: N integers (-1 = null)", outputFormat: "One line per level, space-separated",
    sampleInput: "7\n1 2 3 4 5 -1 6", sampleOutput: "1\n2 3\n4 5 6",
    sampleExplanation: "Three levels.",
    solutions: [
      py("from collections import deque\nn=int(input())\nv=list(map(int,input().split()))\nif n==0 or v[0]==-1: exit()\nroot={'v':v[0]}\nq=deque([root]); i=1\nwhile q and i<n:\n    node=q.popleft()\n    for k in ('l','r'):\n        if i<n and v[i]!=-1:\n            child={'v':v[i]}; node[k]=child; q.append(child)\n        i+=1\nq=deque([root])\nwhile q:\n    sz=len(q); row=[]\n    for _ in range(sz):\n        nd=q.popleft(); row.append(str(nd['v']))\n        if 'l' in nd: q.append(nd['l'])\n        if 'r' in nd: q.append(nd['r'])\n    print(' '.join(row))", "O(n)", "O(n)", "BFS with size counter."),
      java("import java.util.*;\nclass Main{static class N{int v;N l,r;N(int v){this.v=v;}}public static void main(String[]a){Scanner sc=new Scanner(System.in);int n=sc.nextInt();int[]v=new int[n];for(int i=0;i<n;i++)v[i]=sc.nextInt();if(n==0||v[0]==-1)return;N root=new N(v[0]);Queue<N>q=new LinkedList<>();q.add(root);int i=1;while(!q.isEmpty()&&i<n){N nd=q.poll();for(int k=0;k<2&&i<n;k++,i++){if(v[i]!=-1){N c=new N(v[i]);if(k==0)nd.l=c;else nd.r=c;q.add(c);}}}q.add(root);while(!q.isEmpty()){int sz=q.size();StringBuilder sb=new StringBuilder();for(int k=0;k<sz;k++){N nd=q.poll();sb.append(nd.v).append(' ');if(nd.l!=null)q.add(nd.l);if(nd.r!=null)q.add(nd.r);}System.out.println(sb.toString().trim());}}}", "O(n)", "O(n)", "Queue-based BFS."),
    ],
    commonMistakes: ["Not tracking level boundaries", "Index mismatch when building tree"],
    similarProblems: ["Zigzag traversal", "Right side view"], proTip: "Use a sentinel or size counter to separate levels.",
  },
  {
    number: 6, title: "Merge Two Sorted Arrays", slug: "merge-sorted", difficulty: "Easy", topic: "Two Pointers",
    statement: "Merge two sorted arrays into one sorted array.",
    constraints: "1 ≤ N,M ≤ 10⁵", inputFormat: "Line 1: N M\nLine 2: N sorted ints\nLine 3: M sorted ints", outputFormat: "N+M sorted ints",
    sampleInput: "3 3\n1 3 5\n2 4 6", sampleOutput: "1 2 3 4 5 6",
    sampleExplanation: "Classic two-pointer merge.",
    solutions: [
      py("n,m=map(int,input().split())\na=list(map(int,input().split()))\nb=list(map(int,input().split()))\ni=j=0; r=[]\nwhile i<n and j<m:\n    if a[i]<=b[j]: r.append(a[i]); i+=1\n    else: r.append(b[j]); j+=1\nr+=a[i:]; r+=b[j:]\nprint(*r)", "O(n+m)", "O(n+m)", "Two pointers."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);int n=sc.nextInt(),m=sc.nextInt();int[]A=new int[n],B=new int[m];for(int i=0;i<n;i++)A[i]=sc.nextInt();for(int i=0;i<m;i++)B[i]=sc.nextInt();int i=0,j=0;StringBuilder sb=new StringBuilder();while(i<n&&j<m){if(A[i]<=B[j])sb.append(A[i++]).append(' ');else sb.append(B[j++]).append(' ');}while(i<n)sb.append(A[i++]).append(' ');while(j<m)sb.append(B[j++]).append(' ');System.out.println(sb.toString().trim());}}", "O(n+m)", "O(1) extra (ignoring output)", "Two pointers."),
    ],
    commonMistakes: ["Missing tail append", "Using O(n log n) sort instead of merge"],
    similarProblems: ["Merge K sorted lists", "Intersection of two arrays"], proTip: "Compare equal elements stably to keep sort stable.",
  },
  {
    number: 7, title: "Factorial Trailing Zeros", slug: "trailing-zeros", difficulty: "Medium", topic: "Math",
    statement: "Count trailing zeros in N!.",
    constraints: "1 ≤ N ≤ 10⁹", inputFormat: "Integer N", outputFormat: "Trailing zero count",
    sampleInput: "25", sampleOutput: "6",
    sampleExplanation: "Multiples of 5: 5,10,15,20,25 → 5+1 = 6.",
    solutions: [
      py("n=int(input())\nc=0; p=5\nwhile p<=n:\n    c+=n//p; p*=5\nprint(c)", "O(log₅ n)", "O(1)", "Legendre's formula."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){long n=new Scanner(System.in).nextLong();long c=0;for(long p=5;p<=n;p*=5)c+=n/p;System.out.println(c);}}", "O(log n)", "O(1)", "Legendre."),
      cpp("#include<iostream>\nusing namespace std;\nint main(){long long n,c=0;cin>>n;for(long long p=5;p<=n;p*=5)c+=n/p;cout<<c;}", "O(log n)", "O(1)", "Legendre."),
    ],
    commonMistakes: ["Counting only n/5", "Integer overflow on p*=5"],
    similarProblems: ["Preimage size of factorial zeros", "Power of prime in n!"], proTip: "Keep dividing n by 5 in a loop — simpler and overflow-safe.",
  },
  {
    number: 8, title: "Detect Cycle in Linked List", slug: "detect-cycle", difficulty: "Medium", topic: "Linked List",
    statement: "Given head of a singly linked list (next indices, -1 = null, -2 = cycle to that index), detect if a cycle exists.",
    constraints: "0 ≤ N ≤ 10⁴", inputFormat: "Line 1: N\nLine 2: N integers (next pointer index per node, -1 null, -2 = cycle placeholder)", outputFormat: "true or false",
    sampleInput: "4\n1 2 3 1", sampleOutput: "true",
    sampleExplanation: "Node 3 points back to index 1.",
    solutions: [
      py("n=int(input())\nnxt=list(map(int,input().split()))\nseen=set(); i=0\nwhile i!=-1 and i not in seen:\n    seen.add(i); i=nxt[i]\nprint('true' if i in seen else 'false')", "O(n)", "O(n)", "Hash-set of visited indices."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);int n=sc.nextInt();int[]nx=new int[n];for(int i=0;i<n;i++)nx[i]=sc.nextInt();Set<Integer>s=new HashSet<>();int i=0;while(i!=-1&&!s.contains(i)){s.add(i);i=nx[i];}System.out.println(i!=-1&&s.contains(i));}}", "O(n)", "O(n)", "Visited set."),
    ],
    commonMistakes: ["Not handling empty list", "Treating -2 literally"], similarProblems: ["Find cycle start", "Remove cycle"], proTip: "Floyd's tortoise-and-hare gives O(1) space on real pointer lists.",
  },
  {
    number: 9, title: "Climbing Stairs", slug: "climb-stairs", difficulty: "Easy", topic: "DP",
    statement: "You can climb 1 or 2 steps. How many distinct ways to reach step N?",
    constraints: "1 ≤ N ≤ 45", inputFormat: "Integer N", outputFormat: "Ways",
    sampleInput: "5", sampleOutput: "8",
    sampleExplanation: "Fibonacci-like: f(5)=8.",
    solutions: [
      py("n=int(input())\na,b=1,1\nfor _ in range(n-1): a,b=b,a+b\nprint(b)", "O(n)", "O(1)", "Rolling fib."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){int n=new Scanner(System.in).nextInt();int x=1,y=1;for(int i=1;i<n;i++){int t=y;y=x+y;x=t;}System.out.println(y);}}", "O(n)", "O(1)", "Iterative fib."),
      cpp("#include<iostream>\nusing namespace std;\nint main(){int n;cin>>n;int a=1,b=1;for(int i=1;i<n;i++){int t=b;b=a+b;a=t;}cout<<b;}", "O(n)", "O(1)", "Iterative."),
    ],
    commonMistakes: ["Off-by-one on base cases", "Recursive solution TLEs for large N"],
    similarProblems: ["Min cost climbing stairs", "House robber"], proTip: "This is Fibonacci shifted by one — cache or iterate.",
  },
  {
    number: 10, title: "First Non-Repeating Character", slug: "first-unique", difficulty: "Easy", topic: "Hashing",
    statement: "Return the index of the first character that appears exactly once, or -1.",
    constraints: "1 ≤ |S| ≤ 10⁵", inputFormat: "String S (lowercase)", outputFormat: "Index or -1",
    sampleInput: "leetcode", sampleOutput: "0",
    sampleExplanation: "'l' appears once at index 0.",
    solutions: [
      py("s=input().strip()\nfrom collections import Counter\nc=Counter(s)\nfor i,ch in enumerate(s):\n    if c[ch]==1: print(i); break\nelse: print(-1)", "O(n)", "O(1)", "Count then scan."),
      java("import java.util.*;\nclass Main{public static void main(String[]a){String s=new Scanner(System.in).nextLine();int[]cnt=new int[26];for(char c:s.toCharArray())cnt[c-'a']++;for(int i=0;i<s.length();i++)if(cnt[s.charAt(i)-'a']==1){System.out.println(i);return;}System.out.println(-1);}}", "O(n)", "O(1)", "Fixed-size counter."),
    ],
    commonMistakes: ["Returning the character instead of index", "Not handling no-unique case"],
    similarProblems: ["First unique in stream", "Rearrange by frequency"], proTip: "Two passes beats nested loop by a wide margin.",
  },
  {
    number: 11, title: "Rotate Array Right by K", slug: "rotate-array", difficulty: "Medium", topic: "Arrays",
    statement: "Rotate array right by K positions in-place.",
    constraints: "1 ≤ N ≤ 10⁵, 0 ≤ K ≤ 10⁹", inputFormat: "Line 1: N K\nLine 2: N ints", outputFormat: "Rotated array",
    sampleInput: "7 3\n1 2 3 4 5 6 7", sampleOutput: "5 6 7 1 2 3 4",
    sampleExplanation: "Right rotation by 3.",
    solutions: [
      py("n,k=map(int,input().split())\na=list(map(int,input().split()))\nk%=n\ndef rev(l,r):\n    while l<r: a[l],a[r]=a[r],a[l]; l+=1; r-=1\nrev(0,n-1); rev(0,k-1); rev(k,n-1)\nprint(*a)", "O(n)", "O(1)", "Triple reverse trick."),
      java("import java.util.*;\nclass Main{static void rev(int[]a,int l,int r){while(l<r){int t=a[l];a[l++]=a[r];a[r--]=t;}}public static void main(String[]s){Scanner sc=new Scanner(System.in);int n=sc.nextInt(),k=sc.nextInt();int[]a=new int[n];for(int i=0;i<n;i++)a[i]=sc.nextInt();k%=n;rev(a,0,n-1);rev(a,0,k-1);rev(a,k,n-1);StringBuilder sb=new StringBuilder();for(int v:a)sb.append(v).append(' ');System.out.println(sb.toString().trim());}}", "O(n)", "O(1)", "Triple reverse."),
    ],
    commonMistakes: ["Forgetting K mod N", "Off-by-one on reverse ranges"],
    similarProblems: ["Rotate string", "Block swap algorithm"], proTip: "Reverse whole, reverse first K, reverse rest — clean and in-place.",
  },
  {
    number: 12, title: "Longest Palindromic Substring", slug: "longest-palindrome", difficulty: "Hard", topic: "Strings",
    statement: "Return the longest palindromic substring of S.",
    constraints: "1 ≤ |S| ≤ 1000", inputFormat: "String S", outputFormat: "The substring",
    sampleInput: "babad", sampleOutput: "bab",
    sampleExplanation: "'bab' and 'aba' both valid; either accepted.",
    solutions: [
      py("s=input().strip()\ndef expand(l,r):\n    while l>=0 and r<len(s) and s[l]==s[r]: l-=1; r+=1\n    return s[l+1:r]\nres=''\nfor i in range(len(s)):\n    for c in (expand(i,i),expand(i,i+1)):\n        if len(c)>len(res): res=c\nprint(res)", "O(n²)", "O(1)", "Expand around centers."),
      java("import java.util.*;\nclass Main{static String s;static String ex(int l,int r){while(l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r)){l--;r++;}return s.substring(l+1,r);}public static void main(String[]a){s=new Scanner(System.in).nextLine();String res=\"\";for(int i=0;i<s.length();i++){for(String c:new String[]{ex(i,i),ex(i,i+1)})if(c.length()>res.length())res=c;}System.out.println(res);}}", "O(n²)", "O(1)", "Expand around centers."),
    ],
    commonMistakes: ["Handling even/odd separately", "Off-by-one on slice bounds"],
    similarProblems: ["Count palindromic substrings", "Manacher's algorithm"], proTip: "Manacher's gets O(n) but expand-around-center is interview-friendly.",
  },
];

// ---------- Build 90 MCQs per company ----------
type SeedMncMcq = {
  category: "mnc";
  section: string; // company slug
  track: "aptitude" | "reasoning" | "general" | "programming";
  number: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  timeSeconds: number;
  isPyq: boolean;
  year: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];
};

const TRACK_SPLIT: Array<{ track: "aptitude" | "reasoning" | "general" | "programming"; count: number }> = [
  { track: "aptitude", count: 30 },
  { track: "reasoning", count: 20 },
  { track: "general", count: 20 },
  { track: "programming", count: 20 },
];
const YEARS = [2025, 2024, 2023, 2022, 2021];
const DIFFS = ["Easy", "Medium", "Hard"] as const;

function buildMcqsFor(company: MncCompany): SeedMncMcq[] {
  const out: SeedMncMcq[] = [];
  let n = 0;
  for (const slice of TRACK_SPLIT) {
    const bank = BANKS[slice.track];
    const topics = company.tracks[slice.track];
    for (let i = 0; i < slice.count; i++) {
      const t = bank[i % bank.length];
      const topic = topics[i % topics.length];
      n += 1;
      out.push({
        category: "mnc",
        section: company.slug,
        track: slice.track,
        number: `Q.${n}`,
        difficulty: DIFFS[(n - 1) % 3],
        topic,
        timeSeconds: 30 + ((n * 7) % 40),
        isPyq: n % 2 === 0 || n % 5 === 0,
        year: YEARS[(n - 1) % YEARS.length],
        questionText: t.q(topic),
        options: [...t.o],
        correctIndex: t.c,
        explanation: t.e,
        tags: [company.slug, `track:${slice.track}`, topic, "MNC"],
      });
    }
  }
  return out;
}

function buildCodingFor(company: MncCompany, offset: number): SeedCoding[] {
  // pick 10 from 12 with rotation so companies don't look identical
  const picked: SeedCoding[] = [];
  for (let i = 0; i < 10; i++) {
    const base = CODING_BANK[(i + offset) % CODING_BANK.length];
    picked.push({
      ...base,
      slug: `mnc-${company.slug}-${base.slug}`,
      number: i + 1,
    });
  }
  return picked;
}

export const seedMncMcqs: SeedMncMcq[] = MNC_COMPANIES.flatMap(buildMcqsFor);
export const seedMncCoding: Array<SeedCoding & { exam: string }> = MNC_COMPANIES.flatMap((c, i) =>
  buildCodingFor(c, i * 3).map((p) => ({ ...p, exam: `mnc-${c.slug}` })),
);
