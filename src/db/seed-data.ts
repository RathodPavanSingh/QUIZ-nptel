export type SeedCourse = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalUnits: number;
};

export type SeedQuestion = {
  courseSlug: string;
  year: number;
  unit: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export const seedCourses: SeedCourse[] = [
  {
    slug: "cloud-computing",
    name: "Cloud Computing",
    description: "Infrastructure, virtualization, and deployment models",
    icon: "cloud",
    color: "blue",
    totalUnits: 12,
  },
  {
    slug: "computer-networks",
    name: "Computer Networks & Protocols",
    description: "TCP/IP, routing, and network architecture",
    icon: "network",
    color: "sky",
    totalUnits: 12,
  },
  {
    slug: "data-analytics-python",
    name: "Data Analytics with Python",
    description: "Statistical analysis, visualization, and ML techniques",
    icon: "chart",
    color: "green",
    totalUnits: 12,
  },
  {
    slug: "affective-computing",
    name: "Affective Computing",
    description: "Emotion recognition and human-computer interaction",
    icon: "activity",
    color: "gray",
    totalUnits: 12,
  },
  {
    slug: "machine-learning",
    name: "Introduction to Machine Learning",
    description: "Supervised, unsupervised learning and neural networks",
    icon: "brain",
    color: "purple",
    totalUnits: 12,
  },
  {
    slug: "dbms",
    name: "Database Management Systems",
    description: "Relational models, SQL, normalization, and transactions",
    icon: "database",
    color: "amber",
    totalUnits: 12,
  },
];

// Helper to build 10-question banks quickly
function q(
  courseSlug: string,
  year: number,
  unit: number,
  questionText: string,
  options: string[],
  correctIndex: number,
  explanation?: string,
): SeedQuestion {
  return {
    courseSlug,
    year,
    unit,
    questionText,
    options,
    correctIndex,
    explanation,
  };
}

// ============ CLOUD COMPUTING ============
const cloudComputing2022Unit1: SeedQuestion[] = [
  q("cloud-computing", 2022, 1, "What is/are the main requirement(s) of a Cloud Service Provider (CSP)?", ["Increase agility", "Increase cost", "Increase productivity", "Decrease cost"], 0, "Agility, productivity, and cost reduction are all key CSP goals; among these, increased agility is a primary requirement."),
  q("cloud-computing", 2022, 1, "Which of the following is NOT a characteristic of cloud computing?", ["On-demand self-service", "Broad network access", "Limited scalability", "Measured service"], 2, "Cloud computing offers rapid elasticity, not limited scalability."),
  q("cloud-computing", 2022, 1, "Which deployment model is shared by several organizations with common concerns?", ["Public cloud", "Private cloud", "Community cloud", "Hybrid cloud"], 2),
  q("cloud-computing", 2022, 1, "SaaS stands for:", ["System as a Service", "Software as a Service", "Storage as a Service", "Security as a Service"], 1),
  q("cloud-computing", 2022, 1, "Which service model provides virtual machines and storage?", ["IaaS", "PaaS", "SaaS", "FaaS"], 0),
  q("cloud-computing", 2022, 1, "Elasticity in cloud computing refers to:", ["Fixed resource allocation", "Ability to scale resources dynamically", "Reducing latency", "Encrypting data"], 1),
  q("cloud-computing", 2022, 1, "Which of the following is a public cloud provider?", ["OpenStack (self-hosted)", "AWS", "VMware vSphere", "Proxmox"], 1),
  q("cloud-computing", 2022, 1, "Multi-tenancy means:", ["Single user per system", "Multiple users share the same physical resources", "Only paid users allowed", "Only enterprise users"], 1),
  q("cloud-computing", 2022, 1, "Which is a disadvantage of cloud computing?", ["Scalability", "Pay-per-use", "Vendor lock-in", "Global reach"], 2),
  q("cloud-computing", 2022, 1, "NIST defines how many essential characteristics of cloud computing?", ["3", "4", "5", "6"], 2),
];

const cloudComputing2023Unit1: SeedQuestion[] = [
  q("cloud-computing", 2023, 1, "Which of the following best describes hybrid cloud?", ["Only public cloud", "Only private cloud", "Combination of public and private clouds", "Only community cloud"], 2),
  q("cloud-computing", 2023, 1, "Virtualization is primarily used to:", ["Slow down applications", "Abstract hardware resources", "Encrypt files", "Compress data"], 1),
  q("cloud-computing", 2023, 1, "Which hypervisor runs directly on hardware?", ["Type 1", "Type 2", "Type 3", "Nested"], 0),
  q("cloud-computing", 2023, 1, "PaaS is best suited for:", ["End users", "Developers", "Network admins", "DBA only"], 1),
  q("cloud-computing", 2023, 1, "Which is a serverless compute service?", ["EC2", "Lambda", "S3", "RDS"], 1),
  q("cloud-computing", 2023, 1, "Auto-scaling helps to:", ["Reduce availability", "Adjust capacity based on demand", "Increase cost always", "Disable monitoring"], 1),
  q("cloud-computing", 2023, 1, "Which of the following is object storage?", ["EBS", "S3", "EFS", "Instance store"], 1),
  q("cloud-computing", 2023, 1, "Load balancers primarily provide:", ["Data encryption", "Traffic distribution", "Firewalling", "DNS resolution"], 1),
  q("cloud-computing", 2023, 1, "A container is:", ["A full VM", "A lightweight isolated runtime", "A hardware device", "A hypervisor"], 1),
  q("cloud-computing", 2023, 1, "Kubernetes is a:", ["Container runtime", "Container orchestrator", "Hypervisor", "OS kernel"], 1),
];

const cloudComputing2024Unit1: SeedQuestion[] = [
  q("cloud-computing", 2024, 1, "CAP theorem states you can guarantee at most:", ["All three: C, A, P", "Two of C, A, P", "Only P", "Only C"], 1),
  q("cloud-computing", 2024, 1, "Which is NOT a NoSQL type?", ["Document", "Key-value", "Relational", "Graph"], 2),
  q("cloud-computing", 2024, 1, "Which is a message queue service?", ["SQS", "S3", "EC2", "EBS"], 0),
  q("cloud-computing", 2024, 1, "Docker uses which kernel feature for isolation?", ["chroot only", "namespaces and cgroups", "hyperthreading", "swap"], 1),
  q("cloud-computing", 2024, 1, "Which is a benefit of microservices?", ["Tight coupling", "Independent deployability", "Shared database always", "Monolithic scaling"], 1),
  q("cloud-computing", 2024, 1, "Edge computing focuses on:", ["Central processing", "Processing near data source", "Only cloud storage", "Only ML training"], 1),
  q("cloud-computing", 2024, 1, "Which is a container registry?", ["Docker Hub", "GitHub Pages", "Netlify", "Firebase"], 0),
  q("cloud-computing", 2024, 1, "Blue-green deployment aims to:", ["Increase downtime", "Enable zero-downtime releases", "Delete backups", "Randomize traffic"], 1),
  q("cloud-computing", 2024, 1, "IaC stands for:", ["Internet as Code", "Infrastructure as Code", "Integration as Code", "Interface as Code"], 1),
  q("cloud-computing", 2024, 1, "Terraform is used for:", ["Container orchestration", "Provisioning infrastructure declaratively", "CI pipelines only", "Log aggregation"], 1),
];

const cloudComputing2025Unit1: SeedQuestion[] = [
  q("cloud-computing", 2025, 1, "FinOps primarily addresses:", ["Financial accountability of cloud spend", "Firewall operations", "File I/O ops", "Fault-tolerant OS"], 0),
  q("cloud-computing", 2025, 1, "Which is a common IaC tool?", ["Terraform", "Photoshop", "Excel", "PowerPoint"], 0),
  q("cloud-computing", 2025, 1, "GPU instances in cloud are typically used for:", ["Static websites", "Deep learning training", "DNS resolution", "Email hosting"], 1),
  q("cloud-computing", 2025, 1, "A CDN improves:", ["Only security", "Content delivery latency", "Database schema", "Code compilation"], 1),
  q("cloud-computing", 2025, 1, "Which of the following is a container orchestration platform?", ["Kubernetes", "MySQL", "Redis", "Nginx"], 0),
  q("cloud-computing", 2025, 1, "Serverless billing model is usually:", ["Fixed monthly", "Pay per execution / duration", "Yearly subscription", "One time"], 1),
  q("cloud-computing", 2025, 1, "Which storage is best for archival?", ["S3 Standard", "S3 Glacier", "EBS gp3", "Instance store"], 1),
  q("cloud-computing", 2025, 1, "Which is not a CSP?", ["AWS", "Azure", "GCP", "Nginx"], 3),
  q("cloud-computing", 2025, 1, "A VPC is:", ["Virtual Public Cluster", "Virtual Private Cloud", "Very Private Chain", "Virtual Physical Card"], 1),
  q("cloud-computing", 2025, 1, "Which best represents zero trust security?", ["Trust everyone inside", "Verify every request explicitly", "No authentication", "Static passwords"], 1),
];

// Additional Cloud Computing units (2 and 3) for 2022 to make unit-wise interesting
const cloudComputing2022Unit2: SeedQuestion[] = [
  q("cloud-computing", 2022, 2, "Which type of hypervisor is VMware Workstation?", ["Type 1", "Type 2", "Bare-metal", "None"], 1),
  q("cloud-computing", 2022, 2, "Live migration of VMs is used to:", ["Delete VMs", "Move running VMs across hosts", "Compress disks", "Encrypt data"], 1),
  q("cloud-computing", 2022, 2, "Which is a common virtualization technology in Linux?", ["KVM", "IIS", "PowerShell", "Bash"], 0),
  q("cloud-computing", 2022, 2, "Paravirtualization requires:", ["No OS changes", "Modified guest OS", "Only Windows", "Only macOS"], 1),
  q("cloud-computing", 2022, 2, "Container vs VM: containers share the:", ["Kernel", "BIOS", "GPU", "TPM"], 0),
  q("cloud-computing", 2022, 2, "OVF is a format for:", ["Documents", "VM packaging", "Networking", "Compression only"], 1),
  q("cloud-computing", 2022, 2, "Snapshotting a VM captures:", ["Only CPU", "State at a point in time", "Only network", "Only disk"], 1),
  q("cloud-computing", 2022, 2, "Xen is:", ["Language", "Hypervisor", "Compiler", "Database"], 1),
  q("cloud-computing", 2022, 2, "VMotion is a feature of:", ["Hyper-V", "VMware", "KVM", "Xen"], 1),
  q("cloud-computing", 2022, 2, "cgroups limit which resource?", ["Only memory", "CPU, memory, I/O, etc.", "Only network", "Only GPU"], 1),
];

// ============ COMPUTER NETWORKS ============
const networks2023Unit1: SeedQuestion[] = [
  q("computer-networks", 2023, 1, "How many layers are in the OSI model?", ["4", "5", "7", "8"], 2),
  q("computer-networks", 2023, 1, "TCP operates at which OSI layer?", ["Network", "Transport", "Session", "Application"], 1),
  q("computer-networks", 2023, 1, "IP address is at which layer?", ["Data link", "Network", "Transport", "Physical"], 1),
  q("computer-networks", 2023, 1, "Which protocol is connectionless?", ["TCP", "UDP", "SCTP", "HTTP"], 1),
  q("computer-networks", 2023, 1, "MAC address length is:", ["32 bits", "48 bits", "64 bits", "128 bits"], 1),
  q("computer-networks", 2023, 1, "DNS default port is:", ["21", "25", "53", "80"], 2),
  q("computer-networks", 2023, 1, "HTTPS uses port:", ["80", "443", "21", "22"], 1),
  q("computer-networks", 2023, 1, "Which is a routing protocol?", ["HTTP", "OSPF", "SMTP", "IMAP"], 1),
  q("computer-networks", 2023, 1, "Subnet mask 255.255.255.0 is a /?", ["/16", "/20", "/24", "/28"], 2),
  q("computer-networks", 2023, 1, "ARP resolves:", ["IP to MAC", "MAC to IP", "URL to IP", "IP to URL"], 0),
];

const networks2024Unit1: SeedQuestion[] = [
  q("computer-networks", 2024, 1, "IPv6 address length is:", ["32 bits", "64 bits", "96 bits", "128 bits"], 3),
  q("computer-networks", 2024, 1, "Which layer handles framing?", ["Physical", "Data link", "Network", "Transport"], 1),
  q("computer-networks", 2024, 1, "NAT stands for:", ["Network Address Translation", "Node Address Table", "Net Access Token", "None"], 0),
  q("computer-networks", 2024, 1, "SSH default port:", ["21", "22", "23", "25"], 1),
  q("computer-networks", 2024, 1, "Which is stateless?", ["TCP", "UDP", "SCTP", "TLS"], 1),
  q("computer-networks", 2024, 1, "BGP is a:", ["Distance vector protocol", "Path vector protocol", "Link state protocol", "MAC protocol"], 1),
  q("computer-networks", 2024, 1, "CSMA/CD is used in:", ["Wi-Fi", "Ethernet", "Bluetooth", "Zigbee"], 1),
  q("computer-networks", 2024, 1, "TLS provides:", ["Only compression", "Encryption and integrity", "Only routing", "Only DNS"], 1),
  q("computer-networks", 2024, 1, "Which command tests connectivity?", ["ping", "cat", "ls", "grep"], 0),
  q("computer-networks", 2024, 1, "DHCP is used for:", ["Auto IP assignment", "File transfer", "Encryption", "Routing"], 0),
];

const networks2025Unit1: SeedQuestion[] = [
  q("computer-networks", 2025, 1, "QUIC runs over:", ["TCP", "UDP", "SCTP", "ICMP"], 1),
  q("computer-networks", 2025, 1, "HTTP/3 is based on:", ["TCP", "QUIC", "UDP raw", "TLS 1.0"], 1),
  q("computer-networks", 2025, 1, "Which is a link-state protocol?", ["RIP", "OSPF", "BGP", "EIGRP"], 1),
  q("computer-networks", 2025, 1, "TCP handshake steps:", ["2", "3", "4", "5"], 1),
  q("computer-networks", 2025, 1, "Which port is used by SMTP?", ["25", "53", "80", "110"], 0),
  q("computer-networks", 2025, 1, "MTU stands for:", ["Maximum Transmission Unit", "Minimum Transfer Unit", "Media Test Unit", "Manual Transport Unit"], 0),
  q("computer-networks", 2025, 1, "CIDR notation /16 means:", ["16 host bits", "16 network bits", "16 total bits", "16 broadcast"], 1),
  q("computer-networks", 2025, 1, "Which protocol resolves domain to IP?", ["ARP", "DNS", "DHCP", "ICMP"], 1),
  q("computer-networks", 2025, 1, "Traceroute uses:", ["TTL", "MTU", "MAC", "VLAN"], 0),
  q("computer-networks", 2025, 1, "SDN separates:", ["Data and control plane", "Only user data", "Physical and virtual only", "Nothing"], 0),
];

// ============ DATA ANALYTICS PYTHON ============
const daPython2023Unit1: SeedQuestion[] = [
  q("data-analytics-python", 2023, 1, "Which library is used for numerical arrays?", ["NumPy", "Flask", "Django", "Requests"], 0),
  q("data-analytics-python", 2023, 1, "Pandas DataFrame is:", ["1D", "2D tabular", "3D only", "None"], 1),
  q("data-analytics-python", 2023, 1, "Which is used for plotting?", ["Matplotlib", "NumPy", "SQLAlchemy", "Boto3"], 0),
  q("data-analytics-python", 2023, 1, "Mean is a measure of:", ["Spread", "Central tendency", "Skewness", "Kurtosis"], 1),
  q("data-analytics-python", 2023, 1, "Standard deviation measures:", ["Central tendency", "Spread", "Mode", "Median"], 1),
  q("data-analytics-python", 2023, 1, "Which is a supervised learning algorithm?", ["K-means", "Linear regression", "PCA", "DBSCAN"], 1),
  q("data-analytics-python", 2023, 1, "Which is unsupervised?", ["Logistic regression", "K-means", "SVM", "Decision Tree"], 1),
  q("data-analytics-python", 2023, 1, "R² measures:", ["Error", "Goodness of fit", "Sample size", "Bias only"], 1),
  q("data-analytics-python", 2023, 1, "Which is a correlation coefficient?", ["Pearson", "Median", "Mode", "Range"], 0),
  q("data-analytics-python", 2023, 1, "Overfitting means model:", ["Generalizes well", "Fits training too closely", "Ignores data", "Is linear"], 1),
];

const daPython2024Unit1: SeedQuestion[] = [
  q("data-analytics-python", 2024, 1, "Which is used for ML in Python?", ["scikit-learn", "Requests", "Flask", "SQLAlchemy"], 0),
  q("data-analytics-python", 2024, 1, "Cross-validation helps to:", ["Overfit", "Estimate generalization", "Delete data", "Randomize labels"], 1),
  q("data-analytics-python", 2024, 1, "One-hot encoding is used for:", ["Numeric scaling", "Categorical variables", "Missing values", "Dates only"], 1),
  q("data-analytics-python", 2024, 1, "Which is a classification metric?", ["MSE", "F1 score", "R²", "MAE"], 1),
  q("data-analytics-python", 2024, 1, "Which is a regression metric?", ["Accuracy", "Precision", "RMSE", "Recall"], 2),
  q("data-analytics-python", 2024, 1, "Which reduces dimensionality?", ["PCA", "KNN", "SVM", "Logistic regression"], 0),
  q("data-analytics-python", 2024, 1, "Confusion matrix is for:", ["Regression", "Classification", "Clustering", "Ranking"], 1),
  q("data-analytics-python", 2024, 1, "Which handles missing values in pandas?", ["fillna()", "concat()", "merge()", "pivot()"], 0),
  q("data-analytics-python", 2024, 1, "Which is a boosting algorithm?", ["XGBoost", "K-means", "PCA", "DBSCAN"], 0),
  q("data-analytics-python", 2024, 1, "Train-test split typical ratio:", ["50-50", "80-20", "10-90", "100-0"], 1),
];

// ============ AFFECTIVE COMPUTING ============
const affective2024Unit1: SeedQuestion[] = [
  q("affective-computing", 2024, 1, "Affective computing focuses on:", ["Networking", "Emotions in computing", "Compilers", "OS"], 1),
  q("affective-computing", 2024, 1, "Which signal captures facial emotion?", ["EEG only", "Camera / video", "Radar", "Sonar"], 1),
  q("affective-computing", 2024, 1, "FACS stands for:", ["Facial Action Coding System", "Fast Auto Coding Standard", "Facial Analog Coded Signal", "None"], 0),
  q("affective-computing", 2024, 1, "GSR measures:", ["Skin conductance", "Heart rate only", "Brain waves", "Blood pressure"], 0),
  q("affective-computing", 2024, 1, "Which basic emotion set is by Ekman?", ["4", "6", "8", "10"], 1),
  q("affective-computing", 2024, 1, "Valence-arousal is a:", ["Categorical model", "Dimensional model", "Neural model", "None"], 1),
  q("affective-computing", 2024, 1, "EEG measures:", ["Muscle", "Brain electrical activity", "Skin", "Blood"], 1),
  q("affective-computing", 2024, 1, "Which is common for speech emotion features?", ["MFCC", "TCP", "TLS", "UDP"], 0),
  q("affective-computing", 2024, 1, "Multimodal fusion combines:", ["Only text", "Multiple modalities", "Only images", "Only audio"], 1),
  q("affective-computing", 2024, 1, "Empathic HCI aims to:", ["Ignore user state", "Respond to user emotions", "Only render UI", "Only store data"], 1),
];

// ============ MACHINE LEARNING ============
const ml2024Unit1: SeedQuestion[] = [
  q("machine-learning", 2024, 1, "Which is supervised learning?", ["Clustering", "Classification", "Association", "Dimensionality reduction"], 1),
  q("machine-learning", 2024, 1, "Gradient descent is used to:", ["Increase loss", "Minimize loss", "Randomize weights", "Prune trees"], 1),
  q("machine-learning", 2024, 1, "Which is an activation function?", ["ReLU", "Adam", "SGD", "MSE"], 0),
  q("machine-learning", 2024, 1, "Dropout is used to:", ["Increase overfitting", "Reduce overfitting", "Add features", "Encrypt weights"], 1),
  q("machine-learning", 2024, 1, "Which is an optimizer?", ["Adam", "ReLU", "Softmax", "Sigmoid"], 0),
  q("machine-learning", 2024, 1, "CNN is best for:", ["Time series only", "Images", "Text only", "Tabular only"], 1),
  q("machine-learning", 2024, 1, "RNN is designed for:", ["Static images", "Sequential data", "Databases", "Compilers"], 1),
  q("machine-learning", 2024, 1, "Softmax outputs:", ["Probabilities summing to 1", "Random values", "Integers only", "Booleans"], 0),
  q("machine-learning", 2024, 1, "Loss for classification usually:", ["MSE", "Cross entropy", "MAE", "Huber"], 1),
  q("machine-learning", 2024, 1, "Transfer learning reuses:", ["No weights", "Pretrained weights", "Only labels", "Only data"], 1),
];

// ============ DBMS ============
const dbms2024Unit1: SeedQuestion[] = [
  q("dbms", 2024, 1, "SQL stands for:", ["Structured Query Language", "Simple Question Language", "Server Query Layer", "None"], 0),
  q("dbms", 2024, 1, "Primary key must be:", ["Nullable", "Unique and not null", "Duplicated", "Optional"], 1),
  q("dbms", 2024, 1, "Which is a DDL statement?", ["SELECT", "CREATE", "INSERT", "UPDATE"], 1),
  q("dbms", 2024, 1, "Normalization reduces:", ["Redundancy", "Speed", "Security", "Backups"], 0),
  q("dbms", 2024, 1, "ACID stands for:", ["Atomicity, Consistency, Isolation, Durability", "Access, Control, ID, Data", "All, Copy, Insert, Delete", "None"], 0),
  q("dbms", 2024, 1, "A foreign key references:", ["Itself", "Primary key of another table", "Only text", "Only integers"], 1),
  q("dbms", 2024, 1, "Which join returns only matching rows?", ["LEFT", "RIGHT", "INNER", "FULL OUTER"], 2),
  q("dbms", 2024, 1, "Index improves:", ["Write speed only", "Read speed", "Storage size", "Nothing"], 1),
  q("dbms", 2024, 1, "Which is NoSQL?", ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], 2),
  q("dbms", 2024, 1, "Transactions can be:", ["Only committed", "Committed or rolled back", "Only rolled back", "Neither"], 1),
];

export const seedQuestions: SeedQuestion[] = [
  ...cloudComputing2022Unit1,
  ...cloudComputing2022Unit2,
  ...cloudComputing2023Unit1,
  ...cloudComputing2024Unit1,
  ...cloudComputing2025Unit1,
  ...networks2023Unit1,
  ...networks2024Unit1,
  ...networks2025Unit1,
  ...daPython2023Unit1,
  ...daPython2024Unit1,
  ...affective2024Unit1,
  ...ml2024Unit1,
  ...dbms2024Unit1,
];
