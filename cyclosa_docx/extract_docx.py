import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('docs/Nghiep-vu.docx') as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    text_list = []
    for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        p_text = ''.join(node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text)
        if p_text:
            text_list.append(p_text)
    full_text = '\n'.join(text_list)
    print(f'Total paragraphs: {len(text_list)}')
    with open('docs/scratch_nghiep_vu.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
print('Done writing scratch file')

