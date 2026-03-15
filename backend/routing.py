import osmnx as ox
import networkx as nx

def generate_graph(city):

    G = ox.graph_from_place(city, network_type="drive")

    return G


def find_route(G, start_lat, start_lon, end_lat, end_lon):

    start_node = ox.distance.nearest_nodes(G, start_lon, start_lat)
    end_node = ox.distance.nearest_nodes(G, end_lon, end_lat)

    route = nx.shortest_path(G, start_node, end_node, weight="length")

    coords = [(G.nodes[n]["y"], G.nodes[n]["x"]) for n in route]

    return coords