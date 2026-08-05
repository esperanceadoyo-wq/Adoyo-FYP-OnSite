from math import asin, cos, radians, sin, sqrt


def distance_meters(
    origin_latitude: float,
    origin_longitude: float,
    target_latitude: float,
    target_longitude: float,
) -> float:
    earth_radius_meters = 6_371_000
    latitude_delta = radians(target_latitude - origin_latitude)
    longitude_delta = radians(target_longitude - origin_longitude)
    value = (
        sin(latitude_delta / 2) ** 2
        + cos(radians(origin_latitude))
        * cos(radians(target_latitude))
        * sin(longitude_delta / 2) ** 2
    )
    return 2 * earth_radius_meters * asin(sqrt(value))
