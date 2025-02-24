-- Create the projects_with_all view
CREATE VIEW projects_with_all AS
SELECT 
    p.id,
    p.title,
    p.bpm,
    p.date_created,
    p.folder_path_hash,
    p.musical_key,
    p.notes,
    p.path,
    p.release_name,
    json_group_object(
        'album',
        json_object(
            'id', a.id,
            'title', a.title,
            'release_date', a.release_date,
            'notes', a.notes
        )
    ) as album,
    json_group_array(
        json_object(
            'id', c.id,
            'artist_name', c.artist_name,
            'first_name', c.first_name
        )
    ) as contributors
FROM projects p
LEFT JOIN album_projects ap ON p.id = ap.project_id
LEFT JOIN albums a ON ap.album_id = a.id
LEFT JOIN project_contributors pc ON p.id = pc.project_id
LEFT JOIN contributors c ON pc.contributor_id = c.id
GROUP BY p.id;