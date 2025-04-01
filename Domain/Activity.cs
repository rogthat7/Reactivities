﻿namespace Domain;

public class Activity
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    /// <summary>
    /// Location Props
    /// </summary>
    public string City { get; set; } = "" ;
    public string Venue { get; set; } = "";
    public double Latitude { get; set; }    
    public double Longitude { get; set; }
}
