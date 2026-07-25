import type { CodeSolution } from "./schema";

export type SeedProgQ = {
  number: string;
  title: string;
  difficulty: string;
  topic: string;
  language: string;
  timeSeconds: number;
  isPyq: boolean;
  year: number | null;
  questionText: string;
  codeSnippet: string | null;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  tags: string[];
};

export type SeedCoding = {
  number: number;
  title: string;
  slug: string;
  difficulty: string;
  topic: string;
  isPyq: boolean;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  sampleExplanation: string | null;
  solutions: CodeSolution[];
  commonMistakes: string[];
  similarProblems: string[];
  proTip: string | null;
};

export const seedProgramming: SeedProgQ[] = [
  {
    number: "Q.1",
    title: "sizeof with int + float",
    difficulty: "Easy",
    topic: "Data Types & Variables",
    language: "C",
    timeSeconds: 40,
    isPyq: true,
    year: 2023,
    questionText: "What is the output of the following C code?",
    codeSnippet: `#include <stdio.h>
int main() {
    int a = 5;
    float b = 2.0;
    printf("%d", sizeof(a + b));
    return 0;
}`,
    options: [
      "2",
      "4",
      "8",
      "Depends on compiler, usually 4 or 8",
    ],
    correctIndex: 3,
    explanation:
      "In C, when int and float are used in an expression, int is promoted to float. sizeof(float) is typically 4 bytes, but can vary by platform/compiler.",
    tags: ["c", "sizeof", "data-types", "TCS-NQT"],
  },
  {
    number: "Q.2",
    title: "Unsigned integer overflow",
    difficulty: "Easy",
    topic: "Data Types & Variables",
    language: "C",
    timeSeconds: 30,
    isPyq: true,
    year: 2022,
    questionText: "What happens when an unsigned integer exceeds its maximum value in C?",
    codeSnippet: `#include <stdio.h>
int main() {
    unsigned int x = 4294967295U; // max for 32-bit
    x = x + 1;
    printf("%u", x);
    return 0;
}`,
    options: [
      "-1",
      "0",
      "Compilation Error",
      "Maximum value of unsigned int",
    ],
    correctIndex: 1,
    explanation:
      "Unsigned integer arithmetic wraps around (modulo 2^n). Adding 1 to UINT_MAX yields 0.",
    tags: ["c", "overflow", "variables"],
  },
  {
    number: "Q.3",
    title: "Pass by value",
    difficulty: "Easy",
    topic: "Functions & Scope",
    language: "C",
    timeSeconds: 30,
    isPyq: true,
    year: 2023,
    questionText: "What is the output of the following code?",
    codeSnippet: `#include <stdio.h>
void update(int x) {
    x = 10;
}
int main() {
    int a = 5;
    update(a);
    printf("%d", a);
    return 0;
}`,
    options: ["10", "5", "0", "Garbage Value"],
    correctIndex: 1,
    explanation:
      "C uses pass-by-value. update() receives a copy of a, so modifying x does not change a. Output is 5.",
    tags: ["c", "functions", "scope", "pass-by-value"],
  },
  {
    number: "Q.4",
    title: "Array indexing",
    difficulty: "Easy",
    topic: "Arrays & Pointers",
    language: "C",
    timeSeconds: 35,
    isPyq: true,
    year: 2024,
    questionText: "What is the output of the following code?",
    codeSnippet: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40};
    printf("%d", *(arr + 2));
    return 0;
}`,
    options: ["10", "20", "30", "40"],
    correctIndex: 2,
    explanation: "arr + 2 points to the third element (index 2), which is 30.",
    tags: ["c", "arrays", "pointers"],
  },
  {
    number: "Q.5",
    title: "String length",
    difficulty: "Easy",
    topic: "Strings",
    language: "C",
    timeSeconds: 30,
    isPyq: true,
    year: 2023,
    questionText: "What does strlen(\"Hello\") return?",
    codeSnippet: null,
    options: ["4", "5", "6", "Compilation Error"],
    correctIndex: 1,
    explanation: "strlen counts characters excluding the null terminator. \"Hello\" has 5 characters.",
    tags: ["c", "strings", "strlen"],
  },
  {
    number: "Q.6",
    title: "Loop output",
    difficulty: "Medium",
    topic: "Loops & Control",
    language: "C",
    timeSeconds: 45,
    isPyq: true,
    year: 2024,
    questionText: "How many times does the following loop print \"Hi\"?",
    codeSnippet: `#include <stdio.h>
int main() {
    for (int i = 0; i < 5; i++) {
        if (i == 3) continue;
        printf("Hi");
    }
    return 0;
}`,
    options: ["3", "4", "5", "Infinite"],
    correctIndex: 1,
    explanation: "Loop runs for i=0,1,2,3,4. When i==3, continue skips printf. So Hi prints 4 times.",
    tags: ["c", "loops", "continue"],
  },
  {
    number: "Q.7",
    title: "Python list mutability",
    difficulty: "Easy",
    topic: "Python Basics",
    language: "Python",
    timeSeconds: 35,
    isPyq: false,
    year: 2024,
    questionText: "What is the output of the following Python code?",
    codeSnippet: `a = [1, 2, 3]
b = a
b.append(4)
print(a)`,
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "Error"],
    correctIndex: 1,
    explanation: "b and a refer to the same list object. Appending via b mutates a as well.",
    tags: ["python", "lists", "mutability"],
  },
  {
    number: "Q.8",
    title: "Java String comparison",
    difficulty: "Medium",
    topic: "Java Basics",
    language: "Java",
    timeSeconds: 40,
    isPyq: true,
    year: 2023,
    questionText: "What is printed?",
    codeSnippet: `String s1 = new String("Java");
String s2 = new String("Java");
System.out.println(s1 == s2);
System.out.println(s1.equals(s2));`,
    options: [
      "true true",
      "false false",
      "false true",
      "true false",
    ],
    correctIndex: 2,
    explanation: "== compares references (different objects → false). equals compares content (true).",
    tags: ["java", "strings", "equals"],
  },
];

export const seedCodingProblems: SeedCoding[] = [
  {
    number: 1,
    title: "Reverse a String",
    slug: "reverse-a-string",
    difficulty: "Easy",
    topic: "Arrays & Strings",
    isPyq: true,
    statement:
      "Given a string S, write a program to print the reverse of the string without using any built-in reverse function.",
    constraints:
      "Constraints: 1 <= length of string <= 1000\nString contains only alphanumeric characters",
    inputFormat:
      "A single line containing a string S (1 <= |S| <= 1000)",
    outputFormat: "Print the reversed string on a single line",
    sampleInput: "HelloWorld",
    sampleOutput: "dlroWolleH",
    sampleExplanation:
      "The string HelloWorld when reversed becomes dlroWolleH",
    solutions: [
      {
        language: "Python",
        code: `s = input().strip()
result = ''
for i in range(len(s)-1, -1, -1):
    result += s[i]
print(result)`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation:
          "Step 1: Read input string. Step 2: Loop from last index to 0. Step 3: Append each character to result. Step 4: Print result.",
      },
      {
        language: "Java",
        code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        StringBuilder sb = new StringBuilder();
        for (int i = s.length() - 1; i >= 0; i--) {
            sb.append(s.charAt(i));
        }
        System.out.println(sb.toString());
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation:
          "Build reversed string using StringBuilder by iterating from end to start.",
      },
    ],
    commonMistakes: [
      "Using built-in reverse which may not be allowed",
      "Off by one error in loop index",
      "Not handling empty string",
    ],
    similarProblems: [
      "Reverse words in a sentence",
      "Check if string is palindrome",
      "Reverse only vowels in string",
    ],
    proTip:
      "Never use extra space if possible. Two pointer approach solves this in O(1) space if string is represented as a char array.",
  },
  {
    number: 2,
    title: "Find Max and Min in Array",
    slug: "find-max-and-min-in-array",
    difficulty: "Easy",
    topic: "Arrays & Strings",
    isPyq: true,
    statement:
      "Given an array of size N, find the maximum and minimum elements in the array.",
    constraints:
      "Constraints: 1 <= N <= 10^5  -10^9 <= A[i] <= 10^9",
    inputFormat:
      "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Print max and min space-separated.",
    sampleInput: "5\n1 5 3 9 2",
    sampleOutput: "9 1",
    sampleExplanation: "The maximum element is 9 and the minimum is 1.",
    solutions: [
      {
        language: "Python",
        code: `n = int(input())
arr = list(map(int, input().split()))
max_val = arr[0]
min_val = arr[0]
for num in arr:
    if num > max_val: max_val = num
    if num < min_val: min_val = num
print(f"{max_val} {min_val}")`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation:
          "Initialize max and min with the first element. Iterate through the array updating max and min accordingly.",
      },
      {
        language: "Java",
        code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int max = Integer.MIN_VALUE, min = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (x > max) max = x;
            if (x < min) min = x;
        }
        System.out.println(max + " " + min);
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation:
          "Track max/min while reading each element. Use INT_MIN/INT_MAX as initial bounds.",
      },
    ],
    commonMistakes: [
      "Initializing max to 0 instead of INT_MIN",
      "Initializing min to 0 instead of INT_MAX",
      "Sorting the array which takes O(N log N) time",
    ],
    similarProblems: [
      "Kth largest element in an array",
      "Find the peak element",
      "Find the third largest element",
    ],
    proTip:
      "You can process elements in pairs to reduce the number of comparisons by half.",
  },
  {
    number: 3,
    title: "Check Palindrome",
    slug: "check-palindrome",
    difficulty: "Easy",
    topic: "Arrays & Strings",
    isPyq: true,
    statement:
      "Given a string S, check whether it is a palindrome. Print YES if it is, otherwise NO. Ignore case.",
    constraints: "1 <= |S| <= 10^5\nS contains only letters",
    inputFormat: "A single line with string S",
    outputFormat: "Print YES or NO",
    sampleInput: "Racecar",
    sampleOutput: "YES",
    sampleExplanation: "Racecar reversed is racecaR which matches ignoring case.",
    solutions: [
      {
        language: "Python",
        code: `s = input().strip().lower()
i, j = 0, len(s) - 1
ok = True
while i < j:
    if s[i] != s[j]:
        ok = False
        break
    i += 1
    j -= 1
print("YES" if ok else "NO")`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Two-pointer compare from both ends after lowercasing.",
      },
      {
        language: "Java",
        code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim().toLowerCase();
        int i = 0, j = s.length() - 1;
        boolean ok = true;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) { ok = false; break; }
            i++; j--;
        }
        System.out.println(ok ? "YES" : "NO");
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Two pointers from ends until mismatch or middle reached.",
      },
    ],
    commonMistakes: [
      "Forgetting case-insensitive comparison",
      "Using extra reverse string when two pointers suffice",
    ],
    similarProblems: ["Reverse a String", "Valid Palindrome II"],
    proTip: "Two pointers give O(1) extra space and are interview-friendly.",
  },
  {
    number: 4,
    title: "Sum of Array Elements",
    slug: "sum-of-array-elements",
    difficulty: "Easy",
    topic: "Arrays & Strings",
    isPyq: false,
    statement: "Given N integers, print their sum.",
    constraints: "1 <= N <= 10^5\n-10^9 <= A[i] <= 10^9",
    inputFormat: "First line N. Second line N integers.",
    outputFormat: "Print a single integer — the sum.",
    sampleInput: "4\n1 2 3 4",
    sampleOutput: "10",
    sampleExplanation: "1+2+3+4 = 10",
    solutions: [
      {
        language: "Python",
        code: `n = int(input())
arr = list(map(int, input().split()))
print(sum(arr))`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation: "Read all elements and sum them.",
      },
      {
        language: "Java",
        code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) sum += sc.nextLong();
        System.out.println(sum);
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Accumulate into a long to avoid overflow.",
      },
    ],
    commonMistakes: ["Using int for sum when values can overflow", "Off-by-one on N"],
    similarProblems: ["Prefix Sum", "Running Sum of 1D Array"],
    proTip: "Always consider overflow — use 64-bit integers for sums.",
  },
  {
    number: 5,
    title: "Count Vowels",
    slug: "count-vowels",
    difficulty: "Easy",
    topic: "Arrays & Strings",
    isPyq: true,
    statement: "Count the number of vowels (a,e,i,o,u) in a given string (case-insensitive).",
    constraints: "1 <= |S| <= 10^5",
    inputFormat: "A single line string S",
    outputFormat: "Print the count of vowels",
    sampleInput: "Hello World",
    sampleOutput: "3",
    sampleExplanation: "e, o, o → 3 vowels",
    solutions: [
      {
        language: "Python",
        code: `s = input().strip().lower()
vowels = set('aeiou')
print(sum(1 for c in s if c in vowels))`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Lowercase and count characters in the vowel set.",
      },
      {
        language: "Java",
        code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        int c = 0;
        for (char ch : s.toCharArray()) {
            if ("aeiou".indexOf(ch) >= 0) c++;
        }
        System.out.println(c);
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Iterate and check membership in vowel string.",
      },
    ],
    commonMistakes: ["Not handling uppercase", "Counting 'y' as a vowel incorrectly"],
    similarProblems: ["Count consonants", "Remove vowels from string"],
    proTip: "Use a set/lookup table for O(1) vowel checks.",
  },
];
