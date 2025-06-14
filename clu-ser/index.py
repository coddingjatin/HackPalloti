'''
core parameters: 
1. Learning style : visual / auditory / (read/write) / kinesthetic  (https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.esparklearning.com%2Fblog%2Fhands-on-activities-teaching-reading%2F&psig=AOvVaw0dMs10JJMEfTuPHl7vUilh&ust=1738856792169000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCx0NPwrIsDFQAAAAAdAAAAABAE)
2. preferred dificulty level : easy / intermediate / advanced
3. Time commitment : in hours/week (we may also ask about what time of the week like weekends or something)
4. preferred format : video / text / interactive
5. domain interest : startup / learning / job interview ...


in user schema: 
user : {
    ...other generic props,
    learning_style : {
        visual: 3, // score from 0-5
        auditory: 4, 
        knesthetic: 1,
        read_write: 5
    },
    difficulty_pref: "intermediate",
    time_commitment: 5, // 5 hours/week
    preferred_formats: ['video', 'text'],
    interests: ['c', 'system programming']
}

'''
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA

plt.style.use('ggplot')

# matrix
# user vs properties: user on y-axis and properties on x

'''
        learning_style      difficulty      time_commitment     pref_format     interests
user1   4                   3               5                   2               'system-programming' : we should probably enumerate this
user2   4                   3               5                   2               'system-programming'
user3   4                   3               5                   2               'system-programming'
...

'''

data = {}

for i in range(100):
    data[f'user_{i+1}'] = np.random.randint(0, 5, size=5)
   
for key, value in data.items():
    print(f"{key}: {value}")

df = pd.DataFrame(data).T
df.columns = ['learning_style', 'difficulty', 'time_commitment', 'pref_format', 'interest']

# inertia = []
# cluster_range = range(1, 10)

# for k in cluster_range:
#     kmeans = KMeans(n_clusters=k, random_state=0).fit(df)
#     inertia.append(kmeans.inertia_)

# plt.plot(cluster_range, inertia, marker='o')
# plt.xlabel('Number of Clusters')
# plt.ylabel('Inertia')
# plt.title('Elbow Method for Optimal k')
# plt.show()
# plt.savefig("clusters.png")
# k = 4
kmeans = KMeans(n_clusters=5, random_state=0).fit(df)

labels = kmeans.labels_
print("Cluster labels:", labels)

# Step 3: Reduce dimensions using PCA.
pca = PCA(n_components=5)
reduced_data = pca.fit_transform(df)

# Step 4: Plot the clusters.
plt.figure(figsize=(8, 6))
scatter = plt.scatter(reduced_data[:, 0], reduced_data[:, 1], 
                      c=labels, cmap='viridis', alpha=0.7)
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.title("User Clusters")
plt.colorbar(scatter, label='Cluster')
plt.show()
plt.savefig("clusters.png")

clusters = {}
for user, label in zip(df.index, labels):
    if label not in clusters:
        clusters[label] = []
    clusters[label].append(user)

for cluster, users in clusters.items():
    print(f"Cluster {cluster}: {', '.join(users)}")


