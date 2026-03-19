import networkx as nx
try:
    import osmnx as ox
except ImportError:
    ox = None
    print("OSMNX not available - using mock graph")


def generate_graph(city):
    if ox is None:
        # Mock Noida graph
        G = nx.Graph()
        # Sample nodes (lat, lon) around Noida
        nodes = {
            0: {'y': 28.5355, 'x': 77.3910}, # Noida Sector 18
            1: {'y': 28.5350, 'x': 77.3900},
            2: {'y': 28.5400, 'x': 77.4000},
            3: {'y': 28.5300, 'x': 77.3800}
        }
        for i in range(4):
            G.add_node(i, **nodes[i])
        G.add_edge(0, 1, length=500)
        G.add_edge(1, 2, length=1000)
        G.add_edge(2, 3, length=800)
        G.add_edge(3, 0, length=600)
        return G
    G = ox.graph_from_place(city, network_type="drive")
    return G



def find_route(G, start_lat, start_lon, end_lat, end_lon):
    # Mock nearest nodes (0 to 3)
    start_node = 0
    end_node = 3
    if ox:
        start_node = ox.distance.nearest_nodes(G, start_lon, start_lat)
        end_node = ox.distance.nearest_nodes(G, end_lon, end_lat)

        # OSMnx returns a scalar for a single query in current versions, but
        # older code assumed an indexable collection.
        if isinstance(start_node, (list, tuple)):
            start_node = start_node[0]
        if isinstance(end_node, (list, tuple)):
            end_node = end_node[0]
    route = nx.shortest_path(G, start_node, end_node, weight="length")
    coords = [(G.nodes[n]["y"], G.nodes[n]["x"]) for n in route]
    return coords

